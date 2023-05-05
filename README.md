# Website Traffic Tracker

## Description

Website Traffic Tracker is a web application that tracks user visits to web pages. It records the time that each user spends on a web page and stores this data in a MySQL database, including the unique visits per page and the total number of visits per page. The application also provides a dashboard that displays statistics on page visits and time spent on each page, as well as the unique visits per page. Users can filter the dashboard by date range and page title, as well as view detailed information about each visit, such as the device information and the time spent on the page.

## Requirements

### Software used

To run this project, you will need to have the following software installed:

- [Node.js](https://nodejs.org) (version 18.15.0)
- [XAMPP](https://www.apachefriends.org/index.html) or another web server and MySQL database software
- [MySQL](https://www.mysql.com/) (version 8.0.33 or later)

You will also need to create a MySQL database called `traffic_tracker` and import the `traffic_tracker.sql` file located in the `database` directory of the project into the `traffic_tracker` database.

Note: If you are using XAMPP, you can create the `traffic_tracker` database and import the SQL file using the instructions provided in the installation section. If you are using another software, refer to its documentation for instructions on creating a new database and importing an SQL file.

### Database Schema

-- Create traffic_tracker database
CREATE DATABASE traffic_tracker;

-- Use traffic_tracker database
USE traffic_tracker;

-- Create page table
CREATE TABLE page (
  id INT NOT NULL AUTO_INCREMENT,
  url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create visits_version_improved table
CREATE TABLE visits_version_improved (
  id INT NOT NULL AUTO_INCREMENT,
  ip VARCHAR(45) NOT NULL,
  device_type VARCHAR(255) NOT NULL,
  user_agent VARCHAR(255) NOT NULL,
  device_info TEXT NOT NULL,
  visits INT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create page_visit table
CREATE TABLE page_visit (
  id INT NOT NULL AUTO_INCREMENT,
  visit_id INT NOT NULL,
  page_id INT NOT NULL,
  date_visited TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  duration INT NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  KEY visit_id (visit_id),
  KEY page_id (page_id),
  CONSTRAINT page_visit_ibfk_1 FOREIGN KEY (visit_id) REFERENCES visits_version_improved(id),
  CONSTRAINT page_visit_ibfk_2 FOREIGN KEY (page_id) REFERENCES page(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


### ERD

![Traffic Tracker ERD Diagram](./ERD/traffic_tracker_ERD.png)

### Empty Database SQL

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Drop foreign key constraint in page_visit table
ALTER TABLE page_visit DROP FOREIGN KEY page_visit_ibfk_2;

-- Truncate page_visit and page tables
TRUNCATE TABLE page_visit;
TRUNCATE TABLE page;

-- Recreate foreign key constraint in page_visit table
ALTER TABLE page_visit ADD CONSTRAINT page_visit_ibfk_2 FOREIGN KEY (page_id) REFERENCES page(id);

-- Enable foreign key checks again
SET FOREIGN_KEY_CHECKS = 1;


## Installation

[Describe the steps a user needs to take to install and run your project on their own machine.]

## Usage

[Provide instructions for how to use your project, including any command-line arguments, web endpoints, or user interfaces.]

## Contributing

[Outline how other developers can contribute to your project, including how to report bugs, submit feature requests, or make pull requests.]

## License

[Specify the license under which your project is released, including any restrictions or conditions.]

## Acknowledgments

[Give credit to any individuals, organizations, or open source projects that inspired or contributed to your project.]

## Dependencies

[Include a list of packages, libraries, or other dependencies required to run your project.]

## Development Dependencies

[Include a list of packages, libraries, or other dependencies required for development or testing.]