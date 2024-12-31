//  ISTE 330 Deliverable 2 Data Layer
//  Meetings + Planning + Development Began 11/8/2024
//  Alex Vasilcoiu,  Noella Abraham, Sondos Sosak, Daniyah Wong, Jason Wu

import java.sql.*;
import java.util.Scanner;

public class MainApplication {

    private static final Scanner scanner = new Scanner(System.in);
    private static Connection conn;
    final String DEFAULT_DRIVER = "com.mysql.cj.jdbc.Driver";

    public boolean connect(String userName, String password){
        conn = null;
        String url = "jdbc:mysql://localhost:3306/faculty_research_group5";
        try{
            Class.forName(DEFAULT_DRIVER);
            conn = DriverManager.getConnection(url, userName, password);
            System.out.println("\nCreated conn!\n");
        }catch(ClassNotFoundException cnfe){
		    System.out.println("ERROR, CAN NOT CONNECT!!");
            System.out.println("Class");
            System.out.println("ERROR MESSAGE-> "+cnfe);
            return false;
        }catch(SQLException sqle){
		    System.out.println("ERROR SQLExcepiton in connect()");
		    System.out.println("ERROR MESSAGE -> "+sqle);
            sqle.printStackTrace();
            return false;
        }
        return (conn!=null);
    }

    public void close(){
        try {
            // stmt.close();
            conn.close();
        }
        catch(SQLException sqle){
            System.out.println("ERROR IN METHOD close()");
            System.out.println("ERROR MESSAGE -> "+sqle);
        }
    }

    /* 
      OPENING MENU
      OPTION 1 LOGIN 
     */
    public static String login(String email, String password) {

        String sql = "SELECT * FROM account WHERE email = ? AND password = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, email);
            pstmt.setString(2, password);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                String userType = rs.getString("type");
                System.out.println("Login successful! Welcome, " + userType + ".");

                // if ("Student".equalsIgnoreCase(userType)) {
                //     studentMenu(email);
                // } else if ("Public".equalsIgnoreCase(userType)) {
                //     publicMenu(email);
                // } else if ("Faculty".equalsIgnoreCase(userType)) {
                //     facultyMenu(email);
                // } else {
                //     System.out.println("Other user type is not yet implemented.");
                // }
                return userType;
            } else {
                System.out.println("Invalid email or password. Please try again.");
            }
        } catch (SQLException e) {
            System.out.println("Error during login.");
            e.printStackTrace();
        }
        return "failed";
    }

    /* 
      OPENING MENU
      OPTION 2 ADD
      SUB MENU : ADD A NEW USER 
      OPTION 2 REGISTER STUDENT
     */
    public static void registerStudent(String name, String address, String phone, String email, String password, String major, String year) {

        try {
            conn.setAutoCommit(false);

            String insertAccount = "INSERT INTO account (email, password, type) VALUES (?, ?, 'Student')";
            try (PreparedStatement pstmt = conn.prepareStatement(insertAccount)) {
                pstmt.setString(1, email);
                pstmt.setString(2, password);
                pstmt.executeUpdate();
            }

            String insertStudent = "INSERT INTO students (name, address, phone, email, major, year) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertStudent)) {
                pstmt.setString(1, name);
                pstmt.setString(2, address);
                pstmt.setString(3, phone);
                pstmt.setString(4, email);
                pstmt.setString(5, major);
                pstmt.setString(6, year);
                pstmt.executeUpdate();
            }

            conn.commit();
            System.out.println("Student registration successful!");
        } catch (SQLException e) {
            try {
                conn.rollback();
            } catch (SQLException rollbackEx) {
                rollbackEx.printStackTrace();
            }
            e.printStackTrace();
        } finally {
            try {
                conn.setAutoCommit(true);
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }

    /* 
      STUDENT 
      VIEW OWN INTERESTS 
     */
    public static void viewOwnStudentInterests(String email) {
        String sql = "SELECT i.interest FROM student_interests si "
                + "JOIN interests i ON si.interest_ID = i.interest_ID "
                + "WHERE si.student_id = (SELECT student_id FROM students WHERE email = ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();

            System.out.print("\nYour Interests: ");
            boolean hasInterests = false;
            while (rs.next()) {
                if (hasInterests) {
                    System.out.print(" | ");
                }
                System.out.print(rs.getString("interest"));
                hasInterests = true;
            }
            if (!hasInterests) {
                System.out.println("No interests found.");
            } else {
                System.out.println();
            }
        } catch (SQLException e) {
            System.out.println("Error fetching student interests.");
            e.printStackTrace();
        }
    }

    /* 
      STUDENT 
      ADD TO OWN INTERESTS 
     */
    public static void addStudentInterest(String email) {
        while (true) {
            System.out.print("Enter the Interest ID to Add (or type '?' to see available interests): ");
            String input = scanner.nextLine();

            if ("?".equals(input)) {
                displayAllInterests();
            } else {
                try {
                    int interestId = Integer.parseInt(input);
                    String sql = "INSERT INTO student_interests (student_id, interest_ID) "
                            + "VALUES ((SELECT student_id FROM students WHERE email = ?), ?)";
                    try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                        pstmt.setString(1, email);
                        pstmt.setInt(2, interestId);
                        int rowsAffected = pstmt.executeUpdate();

                        if (rowsAffected > 0) {
                            System.out.println("Interest added successfully!");
                        } else {
                            System.out.println("Failed to add interest. Please try again.");
                        }
                    }
                    break;
                } catch (NumberFormatException e) {
                    System.out.println("Invalid input. Please enter a valid Interest ID.");
                } catch (SQLException e) {
                    System.out.println("Error adding interest.");
                    e.printStackTrace();
                    break;
                }
            }
        }
    }

    /* 
      STUDENT 
      DELETE OWN INTERESTS 
     */
    public static void deleteStudentInterest(String email) {
        System.out.print("Enter the Interest ID to Delete: ");
        int interestId = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        String sql = "DELETE FROM student_interests "
                + "WHERE student_id = (SELECT student_id FROM students WHERE email = ?) AND interest_ID = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, email);
            pstmt.setInt(2, interestId);
            int rowsAffected = pstmt.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("Interest deleted successfully!");
            } else {
                System.out.println("No matching interest found to delete.");
            }
        } catch (SQLException e) {
            System.out.println("Error deleting interest.");
            e.printStackTrace();
        }
    }

    /* 
      STUDENT 
      UPDATE OWN INTERESTS 
     */
    public static void updateStudentInterest(String email) {
        System.out.print("Enter the Old Interest ID to Update: ");
        int oldInterestId = scanner.nextInt();
        scanner.nextLine(); // Consume newline
        System.out.print("Enter the New Interest ID: ");
        int newInterestId = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        String sql = "UPDATE student_interests SET interest_ID = ? "
                + "WHERE student_id = (SELECT student_id FROM students WHERE email = ?) AND interest_ID = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, newInterestId);
            pstmt.setString(2, email);
            pstmt.setInt(3, oldInterestId);
            int rowsAffected = pstmt.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("Interest updated successfully!");
            } else {
                System.out.println("No matching interest found to update.");
            }
        } catch (SQLException e) {
            System.out.println("Error updating interest.");
            e.printStackTrace();
        }
    }


    /* 
      OPENING MENU
      OPTION 2 ADD
      SUB MENU : ADD A NEW USER 
      OPTION 3 REGISTER PUBLIC
     */
    public static void registerPublic(String name, String address, String email, String password) {

        try {
            conn.setAutoCommit(false);

            String insertAccount = "INSERT INTO account (email, password, type) VALUES (?, ?, 'Public')";
            try (PreparedStatement pstmt = conn.prepareStatement(insertAccount)) {
                pstmt.setString(1, email);
                pstmt.setString(2, password);
                pstmt.executeUpdate();
            }

            String insertPublic = "INSERT INTO public (name, address, email) VALUES (?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertPublic)) {
                pstmt.setString(1, name);
                pstmt.setString(2, address);
                pstmt.setString(3, email);
                pstmt.executeUpdate();
            }

            conn.commit();
            System.out.println("Public user registration successful!");
        } catch (SQLException e) {
            try {
                conn.rollback();
            } catch (SQLException rollbackEx) {
                rollbackEx.printStackTrace();
            }
            System.out.println("Error during registration.");
            e.printStackTrace();
        } finally {
            try {
                conn.setAutoCommit(true);
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }

    /* 
      PUBLIC 
      VIEW OWN INTERESTS 
     */
    public static void viewSelfPublicInterest(String email) {
        String sql = "SELECT i.interest FROM public p "
                + "JOIN interests i ON p.interest_ID = i.interest_ID "
                + "WHERE p.public_id = (SELECT public_id FROM public WHERE email = ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();

            System.out.print("\nYour Interest: ");
            boolean hasInterests = false;
            while (rs.next()) {
                if (hasInterests) {
                    System.out.print(", ");
                }
                System.out.print(rs.getString("interest"));
                hasInterests = true;
            }
            if (!hasInterests) {
                System.out.println("No interests found.");
            } else {
                System.out.println();
            }
        } catch (SQLException e) {
            System.out.println("Error fetching public interests.");
            e.printStackTrace();
        }
    }

    /* 
      PUBLIC 
      UPDATE OWN INTERESTS 
     */
    public static void updatePublicInterest(String email) {
        System.out.print("Enter new Interest ID or '?' to see the list of interests: ");
        String interestId = scanner.nextLine();

        if ("?".equals(interestId)) {
            displayAllInterests();
        } else {
            try {
                int id = Integer.parseInt(interestId);
                String sql = "UPDATE public SET interest_ID = ? "
                        + "WHERE public_id = (SELECT public_id FROM public WHERE email = ?)";
                try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                    pstmt.setInt(1, id);
                    pstmt.setString(2, email);
                    int rowsAffected = pstmt.executeUpdate();

                    if (rowsAffected > 0) {
                        System.out.println("Interest updated successfully!");
                    } else {
                        System.out.println("No matching interest found to update.");
                    }
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid Interest ID.");
            } catch (SQLException e) {
                System.out.println("Error updating public interest.");
                e.printStackTrace();
            }
        }
    }

    /* 
      PUBLIC 
      DELETE OWN INTERESTS 
     */
    public static void deletePublicInterest(String email) {
        String sql = "UPDATE public SET interest_ID = NULL "
                + "WHERE public_id = (SELECT public_id FROM public WHERE email = ?)";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, email);
            int rowsAffected = pstmt.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("Interest deleted successfully!");
            } else {
                System.out.println("No matching interest found to delete.");
            }
        } catch (SQLException e) {
            System.out.println("Error deleting public interest.");
            e.printStackTrace();
        }
    }

    /* 
      OPENING MENU
      OPTION 2 ADD
      SUB MENU : ADD A NEW USER 
      OPTION 1 REGISTER FACULTY MEMBER
     */
    public static void registerFaculty(String name, String department, String building, String office, String email, String password, Integer abstractId) {
        try {
            conn.setAutoCommit(false);

            // Insert into account table
            String insertAccount = "INSERT INTO account (email, password, type) VALUES (?, ?, 'Faculty')";
            try (PreparedStatement pstmtAccount = conn.prepareStatement(insertAccount)) {
                pstmtAccount.setString(1, email);
                pstmtAccount.setString(2, password);
                pstmtAccount.executeUpdate();
            }

            // Insert into faculty table
            String insertFaculty = "INSERT INTO faculty (name, abstract_id, department, building, office, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmtFaculty = conn.prepareStatement(insertFaculty)) {
                pstmtFaculty.setString(1, name);
                pstmtFaculty.setObject(2, abstractId, java.sql.Types.INTEGER); // Handles null correctly
                pstmtFaculty.setString(3, department);
                pstmtFaculty.setString(4, building);
                pstmtFaculty.setString(5, office);
                pstmtFaculty.setString(6, email);
                pstmtFaculty.setString(7, password);
                pstmtFaculty.executeUpdate();
            }

            conn.commit();
            System.out.println("Faculty registration successful!");
        } catch (SQLException e) {
            System.out.println("Failed to register faculty. Error: " + e.getMessage());
            try {
                conn.rollback();
            } catch (SQLException rollbackEx) {
                System.out.println("Failed to rollback transaction. Error: " + rollbackEx.getMessage());
            }
        } finally {
            try {
                conn.setAutoCommit(true);
            } catch (SQLException ex) {
                System.out.println("Failed to set auto commit. Error: " + ex.getMessage());
            }
        }
    }

    
    /* 
      FACULTY MENU
      SUB MENU : INSERT ABSTRACTS OR INTERESTS MENU
     */
   public static void insertFacultyAbstractsOrInterests(String email) {
       System.out.println("\nChoose an option:");
       System.out.println("1 - Insert an Abstract");
       System.out.println("2 - Insert an Interest");
       System.out.print("Enter your choice: ");
       int choice = scanner.nextInt();
       scanner.nextLine(); // consume newline
   
       switch (choice) {
           case 1:
               insertFacultyAbstract( email);  // Pass email
               break;
           case 2:
               insertFacultyInterest( email);  // Pass email
               break;
           default:
               System.out.println("Invalid option. Please try again.");
               break;
       }
   }
    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 1
      SUB MENU : INSERT ABSTRACTS OR INTERESTS 
      OPTION 1 INSERT ABSTRACTS
     */
   public static void insertFacultyAbstract(String email) {
       System.out.print("Enter title: ");
       String title = scanner.nextLine();
       System.out.print("Enter abstract: ");
       String abstractText = scanner.nextLine();
   
       String sql = "INSERT INTO faculty_abstract (title, abstract) VALUES (?, ?)";
       try (PreparedStatement statement = conn.prepareStatement(sql)) {
           statement.setString(1, title);
           statement.setString(2, abstractText);
           int rowsInserted = statement.executeUpdate();
           if (rowsInserted > 0) {
               System.out.println("A new abstract was inserted successfully!");
           }
       } catch (SQLException e) {
           System.out.println("Failed to insert the abstract.");
           e.printStackTrace();
       }
   }
    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 1
      SUB MENU : INSERT ABSTRACTS OR INTERESTS 
      OPTION 2 INSERT INTERESTS
     */
   public static void insertFacultyInterest(String email) {
       System.out.print("Enter the Interest ID to Add: ");
       int interestID = scanner.nextInt();  // Read Interest ID
       scanner.nextLine();  // Consume newline
   
       // SQL query to insert into the faculty_interests table
       String sql = "INSERT INTO faculty_interests (faculty_ID, interest_ID) " +
                    "VALUES ((SELECT faculty_id FROM faculty WHERE email = ?), ?)";
   
       try (PreparedStatement statement = conn.prepareStatement(sql)) {
           statement.setString(1, email);  
           statement.setInt(2, interestID);  // Use the provided interest ID
   
           int rowsInserted = statement.executeUpdate();
           if (rowsInserted > 0) {
               System.out.println("The interest was successfully added to your profile!");
           } else {
               System.out.println("Failed to add the interest to your profile. Please check the Interest ID.");
           }
       } catch (SQLException e) {
           System.out.println("An error occurred while adding the interest. It might already be linked.");
           e.printStackTrace();
       }
   }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 2
      SUB MENU : UPDATE ABSTRACTS OR INTERESTS 
     */
    public static void updateFacultyAbstractsOrInterests() {
        System.out.println("\nChoose an option:");
        System.out.println("1 - Update an Abstract");
        System.out.println("2 - Update an Interest");
        System.out.print("Enter your choice: ");
        int choice = scanner.nextInt();
        scanner.nextLine(); // consume newline

        switch (choice) {
            case 1:
                updateFacultyAbstract();
                break;
            case 2:
                updateFacultyInterest();
                break;
            default:
                System.out.println("Invalid option. Please try again.");
                break;
        }
    }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 2
      SUB MENU : UPDATE ABSTRACTS OR INTERESTS 
      OPTION 1 UPDATE ABSTRACTS
     */
    public static void updateFacultyAbstract() {
        System.out.print("Enter Abstract ID: ");
        int abstractId = scanner.nextInt();
        scanner.nextLine(); // consume newline
        System.out.print("Enter new title: ");
        String title = scanner.nextLine();
        System.out.print("Enter new abstract: ");
        String abstractText = scanner.nextLine();

        String sql = "UPDATE faculty_abstract SET title = ?, abstract = ? WHERE abstract_ID = ?";
        try (PreparedStatement statement = conn.prepareStatement(sql)) {
            statement.setString(1, title);
            statement.setString(2, abstractText);
            statement.setInt(3, abstractId);
            int rowsUpdated = statement.executeUpdate();
            if (rowsUpdated > 0) {
                System.out.println("Abstract updated successfully!");
            } else {
                System.out.println("No abstract found with the specified ID.");
            }
        } catch (SQLException e) {
            System.out.println("Failed to update the abstract.");
            e.printStackTrace();
        }
    }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 2
      SUB MENU : UPDATE ABSTRACTS OR INTERESTS 
      OPTION 2 UPDATE INTERESTS
     */
    public static void updateFacultyInterest() {
        System.out.print("Enter Interest ID: ");
        int interestId = scanner.nextInt();
        scanner.nextLine(); // consume newline
        System.out.print("Enter new interest: ");
        String interest = scanner.nextLine();

        String sql = "UPDATE interests SET interest = ? WHERE interest_ID = ?";
        try (PreparedStatement statement = conn.prepareStatement(sql)) {
            statement.setString(1, interest);
            statement.setInt(2, interestId);
            int rowsUpdated = statement.executeUpdate();
            if (rowsUpdated > 0) {
                System.out.println("Interest updated successfully!");
            } else {
                System.out.println("No interest found with the specified ID.");
            }
        } catch (SQLException e) {
            System.out.println("Failed to update the interest.");
            e.printStackTrace();
        }
    }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 3
      SUB MENU : DELETE ABSTRACTS OR INTERESTS
     */
    public static void deleteFacultyAbstractsOrInterests() {
        System.out.println("\nChoose an option:");
        System.out.println("1 - Delete an Abstract");
        System.out.println("2 - Delete an Interest");
        System.out.print("Enter your choice: ");
        int choice = scanner.nextInt();
        scanner.nextLine(); // consume newline

        switch (choice) {
            case 1:
                deleteFacultyAbstract();
                break;
            case 2:
                deleteFacultyInterest();
                break;
            default:
                System.out.println("Invalid option. Please try again.");
                break;
        }
    }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 3
      SUB MENU : DELETE ABSTRACTS OR INTERESTS 
      OPTION 1 DELETE ABSTRACTS
     */
    public static void deleteFacultyAbstract() {
        System.out.print("Enter Abstract ID: ");
        int abstractId = scanner.nextInt();

        String sql = "DELETE FROM faculty_abstract WHERE abstract_ID = ?";
        try (PreparedStatement statement = conn.prepareStatement(sql)) {
            statement.setInt(1, abstractId);
            int rowsDeleted = statement.executeUpdate();
            if (rowsDeleted > 0) {
                System.out.println("Abstract deleted successfully!");
            } else {
                System.out.println("No abstract found with the specified ID.");
            }
        } catch (SQLException e) {
            System.out.println("Failed to delete the abstract.");
            e.printStackTrace();
        }
    }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 3
      SUB MENU : DELETE ABSTRACTS OR INTERESTS 
      OPTION 2 DELETE INTERESTS
     */
   public static void deleteFacultyInterest() {
       System.out.print("Enter Faculty ID: ");
       int facultyId = scanner.nextInt();  // Read Faculty ID
       System.out.print("Enter Interest ID to Delete: ");
       int interestId = scanner.nextInt();  // Read Interest ID
       scanner.nextLine();  // Consume newline
   
       String sql = "DELETE FROM faculty_interests WHERE faculty_ID = ? AND interest_ID = ?";
   
       try (PreparedStatement statement = conn.prepareStatement(sql)) {
           statement.setInt(1, facultyId);  // Use the provided faculty ID
           statement.setInt(2, interestId);  // Use the provided interest ID
   
           int rowsDeleted = statement.executeUpdate();
           if (rowsDeleted > 0) {
               System.out.println("Interest successfully removed from the faculty's profile!");
           } else {
               System.out.println("No interest found with the specified Faculty ID and Interest ID.");
           }
       } catch (SQLException e) {
           System.out.println("Failed to delete the interest.");
           e.printStackTrace();
       }
   }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 4
      VIEW OWN INTERESTS
     */
    public static void seeFacultyInterests(String email) {
        String sql = "SELECT GROUP_CONCAT(interests.interest SEPARATOR ' | ') AS interests_list "
                + "FROM interests "
                + "JOIN faculty_interests ON interests.interest_ID = faculty_interests.interest_ID "
                + "JOIN faculty ON faculty.faculty_id = faculty_interests.faculty_ID "
                + "WHERE faculty.email = ?";
        try (PreparedStatement statement = conn.prepareStatement(sql)) {
            statement.setString(1, email);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                String interestsList = resultSet.getString("interests_list");
                if (interestsList == null || interestsList.isEmpty()) {
                    System.out.println("No interests found for this faculty member.");
                } else {
                    System.out.println("Interests: " + interestsList);
                }
            } else {
                System.out.println("No interests found for this faculty member.");
            }
        } catch (SQLException e) {
            System.out.println("Failed to retrieve interests.");
            e.printStackTrace();
        }
    }

    /* 
      FACULTY MEMBER
      FACULTY MENU : OPTION 5
      VIEW OWN ABSTRACTS
     */
    public static void seeFacultyAbstracts(String email) {
        System.out.println("\n--- View Your Abstracts ---");
        String sql = "SELECT faculty_abstract.abstract_ID, title, abstract "
                + "FROM faculty_abstract "
                + "JOIN faculty ON faculty.abstract_id = faculty_abstract.abstract_ID "
                + "WHERE faculty.email = ?";
        try (PreparedStatement statement = conn.prepareStatement(sql)) {
            statement.setString(1, email);
            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.isBeforeFirst()) {
                System.out.println("No abstracts found.");
            } else {
                while (resultSet.next()) {
                    int abstractId = resultSet.getInt("abstract_ID");
                    String title = resultSet.getString("title");
                    String abstractText = resultSet.getString("abstract");
                    System.out.println("Abstract ID: " + abstractId);
                    System.out.println("Title: " + title);
                    System.out.println("Abstract: " + abstractText);
                    System.out.println("-------------------------------");
                }
            }
        } catch (SQLException e) {
            System.out.println("Failed to retrieve abstracts: " + e.getMessage());
            e.printStackTrace();
        }
    
    }
    /* END OF USER FUNCTIONS, START OF SEARCH MATCH FUNCTIONS */
/* 
      PUBLIC 
      SEARCH FOR FACULTY MEMBERS WITH SPECIFIC INTERESTS
      INPUT INTERESTS OUTPUT FACULTY MEMBERS LIST [NAME, EMAIL]
     */
    public static void searchForInterest() {
        displayAllInterests();
        System.out.print("Please Enter Interest ID to Find Students WIth Matching Interests: ");
        int interestId = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        String sql = "SELECT s.name, s.email FROM student_interests si "
                + "JOIN students s USING (student_id) "
                + "WHERE si.interest_ID = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, interestId);
            ResultSet rs = pstmt.executeQuery();

            System.out.println("\nStudents on this Interest:");
            boolean found = false;
            while (rs.next()) {
                String name = rs.getString("name");
                String email = rs.getString("email");
                System.out.println("Name: " + name + ", Email: " + email);
                found = true;
            }
            if (!found) {
                System.out.println("No students found for this interest.");
            }
        } catch (SQLException e) {
            System.out.println("Error searching for experts.");
            e.printStackTrace();
        }
        String sql2 = "SELECT f.name, f.email FROM faculty_interests fi "
                + "JOIN faculty f USING (faculty_id) "
                + "WHERE fi.interest_ID = ?";
        try (PreparedStatement pstmt2 = conn.prepareStatement(sql2)) {
            pstmt2.setInt(1, interestId);
            ResultSet rs = pstmt2.executeQuery();

            System.out.println("\nFaculty on this Interest:");
            boolean found = false;
            while (rs.next()) {
                String name = rs.getString("name");
                String email = rs.getString("email");
                System.out.println("Name: " + name + ", Email: " + email);
                found = true;
            }
            if (!found) {
                System.out.println("No Faculty found for this interest.");
            }
        } catch (SQLException e) {
            System.out.println("Error searching for experts.");
            e.printStackTrace();
        }
    } 
    /* 
      STUDENT 
      SEARCH FOR FACULTY MEMBERS WITH SPECIFIC INTERESTS
      INPUT INTERESTS OUTPUT FACULTY MEMBERS LIST [NAME, BUILDING, OFFICE, EMAIL, COMMON INTERESTS]
     */
   public static void searchFacultyInterests() {
       displayAllInterests();
   
       // Prompt the user to enter 1 to 3 interests
       System.out.println("Please Enter 1 to 3 Interests In Number Form By ID To Find Faculty With Matching Interests (comma separated): ");
       String userInput = scanner.nextLine();
       String[] interests = userInput.split(",");
   
       // Store interests
       for (int i = 0; i < interests.length; i++) {
           interests[i] = interests[i].trim();
       }
   
       // Ensure the user entered at least 1 and at most 3 interests
       if (interests.length < 1 || interests.length > 3) {
           System.out.println("You must enter between 1 and 3 interests.");
           return;
       }
   
       // SQL query
       StringBuilder sql = new StringBuilder(
               "SELECT "
               + "f.name AS faculty_name, "
               + "f.building AS building_number, "
               + "f.office AS office_number, "
               + "f.email AS faculty_email, "
               + "GROUP_CONCAT(i.interest ORDER BY i.interest) AS common_interests "
               + "FROM faculty f "
               + "JOIN faculty_interests fi USING (faculty_id) "
               + "JOIN interests i USING (interest_id) "
               + "JOIN faculty_abstract fa USING (abstract_id) "
               + "WHERE i.interest_id = ? ");
   
       // Add more clauses for each additional interest
       for (int i = 1; i < interests.length; i++) {
           sql.append(" OR i.interest_id = ? ");
       }
   
       sql.append("GROUP BY f.faculty_id, f.name, f.building, f.office, f.email "
               + "ORDER BY f.name");
   
       try (PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {
           for (int i = 0; i < interests.length; i++) {
               pstmt.setInt(i + 1, Integer.parseInt(interests[i])); // Setting interest ID
           }
   
           try (ResultSet rs = pstmt.executeQuery()) {
               // No faculty found
               if (!rs.next()) {
                   System.out.println("No faculty found with common interests for this student.");
                   return;
               }
   
               // Faculty found
               do {
                   String facultyName = rs.getString("faculty_name");
                   String buildingNumber = rs.getString("building_number");
                   String officeNumber = rs.getString("office_number");
                   String facultyEmail = rs.getString("faculty_email");
                   String commonInterests = rs.getString("common_interests");
   
                   System.out.println("Faculty Name: " + facultyName);
                   System.out.println("Building Number: " + buildingNumber);
                   System.out.println("Office Number: " + officeNumber);
                   System.out.println("Faculty Email: " + facultyEmail);
                   System.out.println("Common Interests: " + commonInterests);
                   System.out.println("----------------------------------------");
               } while (rs.next());
           }
       } catch (SQLException e) {
           System.out.println("Error fetching faculty interests.");
           e.printStackTrace();
       }
   }


    /* 
      OPENING MENU OPTION 3
      SEARCH FACULTY ABSTRACTS WITH TERMS
      INPUT SEARCH TERM OUTPUT FACULTY MEMBERS WHO HAVE RELATED ABSTRACT(S) LIST [NAME]
     */
    public static void searchFacultyAbstract() {
        String sql
                = "SELECT "
                + "f.name AS faculty_name "
                + "FROM faculty f "
                + "JOIN faculty_abstract fa USING (abstract_id) "
                + "WHERE fa.abstract LIKE ? "
                + "ORDER BY f.name";

        // Get user input for search term
        System.out.print("Enter search term: ");
        String searchTerm = scanner.next();
        scanner.nextLine();

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, "%" + searchTerm + "%");

            try (ResultSet rs = pstmt.executeQuery()) {
                if (!rs.next()) {
                    System.out.println("No faculty abstracts found matching the search term.");
                    return;
                }
                System.out.println("\nFaculty Members Matching Abstract Search Term:");
                do {
                    String facultyName = rs.getString("faculty_name");
                    System.out.println("Faculty Name: " + facultyName);
                } while (rs.next());
            }
        } catch (SQLException e) {
            System.out.println("Error searching faculty abstracts.");
            e.printStackTrace();
        }
    }

    /* 
      FACULTY 
      SEARCH FOR STUDENTS WITH SPECIFIC INTERESTS
      INPUT INTERESTS OUTPUT STUDENTS LIST [NAME, EMAIL, PHONE]
     */
    public static void searchStudentInterests() {
        String sql = "SELECT interest_ID, interest FROM interests";
        try (PreparedStatement pstmt = conn.prepareStatement(sql); ResultSet rs = pstmt.executeQuery()) {
            System.out.println("\nAvailable Interests:");
            while (rs.next()) {
                int id = rs.getInt("interest_ID");
                String interest = rs.getString("interest");
                System.out.println(id + ": " + interest);
            }
        } catch (SQLException e) {
            System.out.println("Error fetching interests.");
            e.printStackTrace();
        }

        System.out.print("Enter Interest ID to search for students: ");
        int interestId = scanner.nextInt();
        scanner.nextLine();

        String sql1
                = "SELECT s.name, s.email, s.phone "
                + "FROM students s "
                + "JOIN student_interests si ON s.student_id = si.student_id "
                + "WHERE si.interest_ID = ?";
        try (PreparedStatement pstmt = conn.prepareStatement(sql1)) {
            pstmt.setInt(1, interestId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (!rs.next()) {
                    System.out.println("No students found with the selected interest.");
                    return;
                }
                System.out.println("\nStudents Matching Interest:");
                do {
                    String name = rs.getString("name");
                    String email = rs.getString("email");
                    String phone = rs.getString("phone");
                    System.out.println("Name: " + name + ", Email: " + email + ", Phone: " + phone);
                } while (rs.next());
            }
        } catch (SQLException e) {
            System.out.println("Error fetching students by interest.");
            e.printStackTrace();
        }
    }

    /* 
      DISPLAY ALL INTERESTS
     */
    public static void displayAllInterests() {
        String sql = "SELECT interest_ID, interest FROM interests";
        try (PreparedStatement pstmt = conn.prepareStatement(sql); ResultSet rs = pstmt.executeQuery()) {
            System.out.println("\nAvailable Interests:");
            while (rs.next()) {
                int id = rs.getInt("interest_ID");
                String interest = rs.getString("interest");
                System.out.println(id + ": " + interest);
            }
        } catch (SQLException e) {
            System.out.println("Error fetching interests.");
            e.printStackTrace();
        }
    }
}

    
    
    
    
