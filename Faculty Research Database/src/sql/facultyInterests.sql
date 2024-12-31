--  ISTE 330 Deliverable 2 Data Layer
--  Meetings + Planning + Development Began 11/8/2024
--  Alex Vasilcoiu,  Noella Abraham, Sondos Sosak, Daniyah Wong, Jason Wu

-- CREATING THE DATABASE
DROP DATABASE IF EXISTS faculty_research_group5;
CREATE DATABASE faculty_research_group5;
USE faculty_research_group5;

-- CREATION OF THE INTERESTS TABLE
DROP TABLE IF EXISTS interests;
CREATE TABLE interests (
    interest_ID INT PRIMARY KEY,
    interest VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATION OF THE FACULTY_ABSTRACT TABLE
DROP TABLE IF EXISTS faculty_abstract;
CREATE TABLE faculty_abstract (
    abstract_ID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    abstract MEDIUMTEXT NOT NULL  
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATION OF THE FACULTY TABLE
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    abstract_id INT,
    department VARCHAR(100),
    building VARCHAR(10),  
    office VARCHAR(30),    
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    FOREIGN KEY (abstract_id) REFERENCES faculty_abstract(abstract_ID)
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATION OF THE STUDENTS TABLE
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(50) UNIQUE,
    major VARCHAR(100),
    year VARCHAR(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATION OF THE PUBLIC USERS TABLE
DROP TABLE IF EXISTS public;
CREATE TABLE public (
    public_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    address VARCHAR(100),
    email VARCHAR(50) UNIQUE,
    interest_id INT,
    FOREIGN KEY (interest_id) REFERENCES interests(interest_ID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATION OF THE ACCOUNTS TABLE
DROP TABLE IF EXISTS account;
CREATE TABLE account (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('Faculty', 'Student', 'Public') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- CREATION OF THE FACULTY_INTERESTS AND STUDENT_INTERESTS TABLES
DROP TABLE IF EXISTS faculty_interests;
CREATE TABLE faculty_interests (
    faculty_ID INT,
    interest_ID INT,
    PRIMARY KEY (faculty_ID, interest_ID),
    FOREIGN KEY (faculty_ID) REFERENCES faculty(faculty_id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (interest_ID) REFERENCES interests(interest_ID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS student_interests;
CREATE TABLE student_interests (
    student_id INT,
    interest_ID INT,
    PRIMARY KEY (student_id, interest_ID),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (interest_ID) REFERENCES interests(interest_ID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- INSERTING INTO ACCOUNTS TABLE
INSERT INTO account (email, password, type) VALUES
('jhabermas@rit.edu', 'staffpass123', 'Faculty'),
('dbogaard@rit.edu', 'staffpass123', 'Faculty'),
('cleclerc@rit.edu', 'studentpass123', 'Student'),
('hjames@rit.edu', 'studentpass456', 'Student'),
('jbond@gmail.com', 'public123', 'Public');

-- INSERTING INTO PUBLIC USERS TABLE
INSERT INTO public (name, address, email, interest_id) VALUES 
('James Bond', '777 Wow St', 'jbond@gmail.com', 1);

-- INSERTING INTO ABSTRACTS TABLE
INSERT INTO faculty_abstract (title, abstract) VALUES 
("BOOKS DATABASE", "The project is based on a book database system pertaining to various needs of the user. The basic interface involves querying books according to language, title, author, publisher, ISBN. We support services for buying and selling used books or books used in specific IIT Kanpur courses. We build a personal profile page which is used for handling the transactions between various students. We implement a 'recommendation system' for recommending books to be used in a particular course in addition to their availability in the library. The system gives advice for cheap used books available at the time, when that book is not found in the library."),
("Learn C and C++ by Samples", "This book, Learn C and C++ by Samples written by James R. Habermas, is a companion to A First Book Ansi C++ by Gary Bronson. It is the author’s firm belief that one can never have too many samples. If a textbook is to be useful, it needs primary support through an instructor and/or more samples. This textbook contains a wealth of useful C & C++ samples that are fashioned to further demonstrate the topics outlined in the text."),
("C through Design", "This book presents ‘standard’ C, i.e., code that compiles cleanly with a compiler that meets the ANSI C standard. This book has over 90 example programs that illustrate the topics of each chapters. In addition complete working programs are developed fully, from design to program output. This book is filled with Antibugging Notes (the stress traps to be avoided), and Quick Notes, that emphasize important points to be remembered."),
("Introduction to Computing and Programming in PYTHON – A Multimedia Approach", "The programming language used in this book is Python. Python has been described as ‘executable pseudo-code.’ I have found that both computer science majors and non majors can learn Python. Since Python is actually used for communications tasks (e.g., Web site Development), it’s relevant language for an in introductory computing course. The specific dialect of Python used in this book is Jython. Jython is Python. The differences between Python (normally implemented in C) and Jython (which is implemented in Java) are akin to the differences between any two language implementations (e.g., Microsoft vs. GNU C++ implementations).");

-- INSERTING INTO INTERESTS TABLE
INSERT INTO interests (interest_ID, interest) VALUES
(1, "Pascal"),
(2, "Java"),
(3, "JDBC"),
(4, "MySQL"),
(5, "Python"),
(6, "COBOL"),
(7, "C"),
(8, "Cybersecurity"),
(9, "C++"),
(10, "C#"),
(11, "Javascript"),
(12, "PHP"),
(13, "ADA"),
(14, "Ruby");

-- INSERTING INTO FACULTY USERS TABLE
INSERT INTO faculty (name, abstract_id, department, building, office, email, password) VALUES
("Jim Habermas", 1, "Computing and Information Sciences", "GOL", "123", "jhabermas@rit.edu", "staffpass123"),
("Dan Bogaard", 4, "Computing and Information Sciences", "GOL", "234", "dbogaard@rit.edu", "staffpass123");

-- INSERTING INTO STUDENT USERS TABLE
INSERT INTO students (name, address, phone, email, major, year) VALUES
("Charles Leclerc", "123 Main St", "1234567890", "cleclerc@rit.edu", "Computing and Information Sciences", "Junior"),
("Harley James", "345 Maple St", "2345678912", "hjames@rit.edu", "Electrical Engineering", "Senior");

-- INSERTING INTO FACULTY INTERESTS TABLE
INSERT INTO faculty_interests (faculty_ID, interest_ID) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9),
(1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (2, 7), (2, 5), (2, 1), (2, 3);

-- INSERTING INTO STUDENT INTERESTS TABLE
INSERT INTO student_interests (student_id, interest_ID) VALUES
(1,1), (1,2), (1,3), (1,4), (1,5), (1,6), (1,7),
(2,8), (2,1), (2,9), (2,11), (2,7), (2,13), (2,12);
