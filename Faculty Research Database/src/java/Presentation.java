//  ISTE 330 Presentation Layer
//  Alex Vasilcoiu,  Noella Abraham, Sondos Sosak, Daniyah Wong, Jason Wu

import java.util.Scanner;
import java.sql.*;

public class Presentation {
    private static final Scanner scanner = new Scanner(System.in);
	MainApplication dl = new MainApplication();
	String userName = new String();
	String password = new String();

	public Presentation(){

        // Prompting for username
        System.out.println("Please enter MySQL information");
        System.out.print("Username -> ");
        userName = scanner.nextLine();

        // Prompting for password
        System.out.print("Password (Default is 'student') -> ");
        String temp_pass = scanner.nextLine();

        // Default password check
        if (temp_pass.equals("")) {
            password = "student";
        } else {
            password = temp_pass;
        }
		
        if(dl.connect(userName, password)){
            int choice;
            do {
                displayMainMenu();
                choice = scanner.nextInt();
                scanner.nextLine(); // Consume newline

                switch (choice) {
                    case 1:
                        System.out.print("\nEnter Your Email: ");
                        String email = scanner.nextLine();
                        System.out.print("Enter Your Password: ");
                        String password = scanner.nextLine();
                        String loginType = dl.login(email, password);
                        loginType = loginType.toLowerCase();
                        loginDisplay(loginType, email);
                        break;
                    case 2:
                        System.out.println("\n--- Registration ---");
                        System.out.println("1 - Faculty");
                        System.out.println("2 - Student");
                        System.out.println("3 - Public User");
                        System.out.print("Choose user type: ");
                        int userType = scanner.nextInt();
                        scanner.nextLine(); // Consume newline
                        register(userType);
                        break;
                    case 3:
                        System.out.println("Exiting program. Goodbye!");
                        break;
                    default:
                        System.out.println("Invalid choice. Please try again.");
                }
            } while (choice != 3);
            dl.close();
        }else{
            // Connection fails
            System.out.println("No DB Connection");

        }
    }

    private static void displayMainMenu() {
        System.out.println("\n--- Faculty Research Project ---");
        System.out.println("1 - Login");
        System.out.println("2 - Register");
        System.out.println("3 - Quit");
        System.out.print("Enter your choice: ");
    }

    private void register(int userType){
        switch (userType) {
            case 1:
                System.out.print("\nEnter Your Full Name: ");
                String name = scanner.nextLine();
                System.out.print("Enter Your Department: ");
                String department = scanner.nextLine();
                System.out.print("Enter Your Building: ");
                String building = scanner.nextLine();
                System.out.print("Enter Your Office Number: ");
                String office = scanner.nextLine();
                System.out.print("Enter Your Faculty Email: ");
                String email = scanner.nextLine();
                System.out.print("Enter Your Password: ");
                String password = scanner.nextLine();
                System.out.print("Enter Your Abstract ID (press enter for no abstracts): ");
                String abstractIdInput = scanner.nextLine();
                Integer abstractId = abstractIdInput.isEmpty() ? null : Integer.parseInt(abstractIdInput);
                dl.registerFaculty(name, department, building, office, email, password, abstractId);
                break;
            case 2:
                System.out.print("\nEnter Your Full Name: ");
                name = scanner.nextLine();
                System.out.print("Enter Your Address: ");
                String address = scanner.nextLine();
                System.out.print("Enter Your Phone Number: ");
                String phone = scanner.nextLine();
                System.out.print("Enter Your Student Email: ");
                email = scanner.nextLine();
                System.out.print("Enter Your Password: ");
                password = scanner.nextLine();
                System.out.print("Enter Your Major: ");
                String major = scanner.nextLine();
                System.out.print("Enter Your Year: ");
                String year = scanner.nextLine();
                dl.registerStudent(name, address, phone, email, password, major, year);
                break;
            case 3:
                System.out.print("\nEnter Your Name or Your Business's Name: ");
                name = scanner.nextLine();
                System.out.print("Enter Your Address: ");
                address = scanner.nextLine();
                System.out.print("Enter Your Email: ");
                email = scanner.nextLine();
                System.out.print("Enter Your Password: ");
                password = scanner.nextLine();
                dl.registerPublic(name, address, email, password);
                break;
            default:
                System.out.println("Invalid user type. Returning to main menu.");
        }
    }

    private void loginDisplay(String userType, String email){
        switch (userType){
            case "student":
                int choice;
                do {
                    displayStudentMenu();
                    choice = scanner.nextInt();
                    scanner.nextLine(); // Consume newline
                    switch (choice) {
                        case 1:
                            dl.searchFacultyInterests();
                            break;
                        case 2:
                            dl.searchFacultyAbstract();
                            break;
                        case 3:
                            dl.viewOwnStudentInterests( email);
                            break;
                        case 4:
                            dl.addStudentInterest( email);
                            break;
                        case 5:
                            dl.deleteStudentInterest( email);
                            break;
                        case 6:
                            dl.updateStudentInterest( email);
                            break;
                        case 7:
                            System.out.println("Returning to main menu...");
                            break;
                        default:
                            System.out.println("Invalid choice. Please try again.");
                    }
                } while (choice != 7);
                break;
            case "faculty":
                do {
                    displayFacultyMenu();
                    System.out.print("Enter your choice: ");
                    choice = scanner.nextInt();
                    scanner.nextLine(); // Consume newline
            
                    switch (choice) {
                        case 1:
                            dl.searchStudentInterests();
                            break;
                        case 2:
                            dl.insertFacultyAbstractsOrInterests( email);
                            break;
                        case 3:
                            dl.updateFacultyAbstractsOrInterests();
                            break;
                        case 4:
                            dl.deleteFacultyAbstractsOrInterests();
                            break;
                        case 5:
                            dl.seeFacultyInterests( email);
                            break;
                        case 6:
                            dl.seeFacultyAbstracts( email);
                            break;
                        case 7:
                            System.out.println("Logging out and returning to main menu...");
                            break;
                        default:
                            System.out.println("Invalid choice. Please try again.");
                            break;
                    }
                } while (choice != 7);
                break;
            case "public":
                do {
                    displayPublicMenu();
                    choice = scanner.nextInt();
                    scanner.nextLine(); // Consume newline

                    switch (choice) {
                        case 1:
                            dl.searchForInterest();
                            break;
                        case 2:
                            System.out.println("Returning to main menu...");
                            break;
                        default:
                            System.out.println("Invalid choice. Please try again.");
                    }
                } while (choice != 2);
                break;
        }
    }

    public void displayStudentMenu() {
        System.out.println("\n--- Student Menu ---");
        System.out.println("1 - Search Faculty Interests");
        System.out.println("2 - Search Faculty Abstracts");
        System.out.println("3 - View Own Interests");
        System.out.println("4 - Add Interests");
        System.out.println("5 - Delete Interests");
        System.out.println("6 - Update Interests");
        System.out.println("7 - Quit");
        System.out.print("Enter your choice: ");
    }

    public void displayFacultyMenu() {
        System.out.println("\n--- Faculty Menu ---");
        System.out.println("1 - Search Student Interests");
        System.out.println("2 - Insert Abstracts or Interests");
        System.out.println("3 - Update Abstracts or Interests");
        System.out.println("4 - Delete Abstracts or Interests");
        System.out.println("5 - See Own Interests");
        System.out.println("6 - See Own Abstracts");
        System.out.println("7 - Quit");
    }

    public void displayPublicMenu() {
        System.out.println("\n--- Public Menu ---");
        System.out.println("1 - Search for students on Interest");
        System.out.println("2 - Quit");
        System.out.print("Enter your choice: ");
    }
    

    public static void main(String [] args){
	    System.out.println("Authors: Alex Vasilcoiu, Noella Abraham, Sondos Sosak, Daniyah Wong, Jason Wu");
		new Presentation();
	}
}
