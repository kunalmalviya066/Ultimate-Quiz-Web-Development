CREATE DATABASE quiz_app;
USE quiz_app;
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
SHOW TABLES;
SET FOREIGN_KEY_CHECKS = 1;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS result_details;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS subjects;

SET FOREIGN_KEY_CHECKS = 1;


COMMIT;
select * from subjects;
INSERT INTO subjects (name) VALUES
('Quants'), ('Reasoning'), ('English'),('General Awareness'), ('Checklist');

rollback;
commit;
select * from subjects;
CREATE TABLE topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    subject_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
INSERT INTO topics (name, subject_id) VALUES
('Simplification', 1),
('Quadratic Equations', 1),
('Number/Missing Series', 1),
('Percentage', 1),
('Ratio and Proportion', 1),
('Arithmetic (Mixed)', 1),
('Data Interpretation (Demo)', 1);

INSERT INTO topics (name, subject_id) VALUES
('Coding Decoding', 2),
('Inequality', 2),
('Coded Inequality', 2),
('Blood Relation', 2),
('AlphaNumeric Series', 2),
('Syllogism', 2),
('Alpha Series', 2),
('Number Test', 2),
('Direction and Distance', 2),
('Miscellaneous', 2),
('Order and Ranking', 2);

select * from topics;

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    answer INT NOT NULL,  -- 0=A, 1=B, 2=C, 3=D
    explanation TEXT,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

ALTER TABLE questions
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;
commit;


CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total INT NOT NULL,
    correct INT NOT NULL,
    incorrect INT NOT NULL,
    accuracy DECIMAL(5,2),
    time_taken INT
);
select * from results;
CREATE TABLE result_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    result_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer INT,
    marked_review BOOLEAN,
    FOREIGN KEY (result_id) REFERENCES results(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);
select * from result_details;

drop table users;
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




