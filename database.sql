create database airport_db;
use airport_db;

CREATE TABLE User
(
    user_id INT AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(511) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    account_status TINYINT NOT NULL DEFAULT 1,  -- e.g., 0=inactive, 1=active
    date_of_birth DATE,
	role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    PRIMARY KEY (user_id),
    UNIQUE (email)
);


CREATE TABLE Payment_Methods
(
    payment_method_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL,
    payment_type        VARCHAR(50) NOT NULL,         -- e.g., "Credit Card", "PayPal"
    payment_token       VARCHAR(255) NOT NULL,        -- Secure token from gateway (e.g., Stripe customer+card ID)
    card_last_four      CHAR(4) NOT NULL,             -- Last 4 digits from the card
    card_brand          VARCHAR(50),                  -- e.g., "Visa", "MasterCard", "Amex"
    expiration_month    TINYINT,                      -- 1-12 (optional if your token includes it)
    expiration_year     SMALLINT,                     -- e.g., 2025 (optional if your token includes it)
    is_default          TINYINT NOT NULL DEFAULT 0,   -- 0 = not default, 1 = default
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


CREATE TABLE Transaction
(
    transaction_id INT AUTO_INCREMENT NOT NULL,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,             -- to handle monetary values
    transaction_status VARCHAR(50) NOT NULL,   -- e.g., "pending", "completed"
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method_id INT NOT NULL,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (payment_method_id) REFERENCES Payment_Methods(payment_method_id)
);


CREATE TABLE Flights
(
    flight_id INT AUTO_INCREMENT NOT NULL,
    flight_number VARCHAR(20) NOT NULL,        -- e.g., "AC123", could also be INT if strictly numeric
    airline VARCHAR(100) NOT NULL,
    departure_airport VARCHAR(10) NOT NULL,    -- e.g., "JFK", "LAX"
    arrival_airport VARCHAR(10) NOT NULL,
    total_capacity INT NOT NULL,
    available_seats INT NOT NULL,
    status VARCHAR(50) NOT NULL,               -- e.g., "on-time", "delayed"
    created_by INT NOT NULL,                   -- possibly references some staff/admin ID
    PRIMARY KEY (flight_id)
);


CREATE TABLE Air_Control_Dep
(
    staff_id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'air control staff',
    password VARCHAR(511) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    department VARCHAR(100),                  
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    PRIMARY KEY (staff_id),
    UNIQUE (username)
);


CREATE TABLE Air_Control_Activity_Log
(
    ac_log_id INT AUTO_INCREMENT NOT NULL,
    staff_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL,  -- e.g., "Update Flight", "Cancel Flight"
    activity_timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    flight_id INT NOT NULL,
    PRIMARY KEY (ac_log_id),
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id),
    FOREIGN KEY (staff_id) REFERENCES Air_Control_Dep(staff_id)
);


CREATE TABLE Bookings
(
    bookings_id INT AUTO_INCREMENT NOT NULL,
    flight_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,             -- e.g., "12A"
    extra_baggage TINYINT NOT NULL DEFAULT 0,     -- 0=false, 1=true
    travel_insurance TINYINT NOT NULL DEFAULT 0,  -- 0=false, 1=true
    booking_status VARCHAR(50) NOT NULL,          -- e.g., "confirmed", "canceled"
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (bookings_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
);


CREATE TABLE Feedback
(
    feedback_id INT AUTO_INCREMENT NOT NULL,
    flight_id INT NOT NULL,
    rating TINYINT NOT NULL,            -- range 1..5? Could also be INT
    comments TEXT,                      -- for potentially larger user input
    feedback_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    PRIMARY KEY (feedback_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
);


CREATE TABLE Admin
(
    admin_id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    password VARCHAR(511) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    PRIMARY KEY (admin_id),
    UNIQUE (username),
    UNIQUE (email)
);


CREATE TABLE Admin_Activity_Log
(
    log_id INT AUTO_INCREMENT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    activity_timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    admin_id INT NOT NULL,
    PRIMARY KEY (log_id),
    FOREIGN KEY (admin_id) REFERENCES Admin(admin_id)
);


CREATE TABLE manages
(
    staff_id INT NOT NULL,
    flight_id INT NOT NULL,
    PRIMARY KEY (staff_id, flight_id),
    FOREIGN KEY (staff_id) REFERENCES Air_Control_Dep(staff_id),
    FOREIGN KEY (flight_id) REFERENCES Flights(flight_id)
);

-- Insert sample users
-- For John Doe: original password is "user1"
-- For Jane Smith: original password is "user2"
INSERT INTO User (email, password, first_name, last_name, phone_number, date_of_birth)
VALUES
  ('john.doe@example.com', '$pbkdf2-sha256$29000$4nyPMSaE0BpjTMnZ21srBQ$viTmjR9fZRzcDQg4ba6UbeQWhJxU6TTi/Z3FfIdA7gQ', 'John', 'Doe', '555-1234', '1985-06-15'),
  ('jane.smith@example.com', '$pbkdf2-sha256$29000$dm4thXCu1dpby3mv9V6L0Q$gkCi2tsnj5hTJMDa/NCspsjPV5sEKZVNJgJkSTfxP/8', 'Jane', 'Smith', '555-5678', '1990-08-20');

-- Insert sample payment methods (no passwords here)
INSERT INTO Payment_Methods (user_id, payment_type, payment_token, card_last_four, card_brand, expiration_month, expiration_year, is_default)
VALUES
  (1, 'Credit Card', 'tok_visa_12345', '4242', 'Visa', 12, 2025, 1),
  (2, 'PayPal', 'paypal_token_67890', '0000', 'N/A', NULL, NULL, 1);

-- Insert sample flights (created_by is set to 1 as an example)
INSERT INTO Flights (flight_number, airline, departure_airport, arrival_airport, total_capacity, available_seats, status, created_by)
VALUES
  ('AC123', 'Air Canada', 'JFK', 'LAX', 200, 50, 'on-time', 1),
  ('UA456', 'United Airlines', 'LAX', 'ORD', 180, 20, 'delayed', 1);

-- Insert sample air control staff
-- For Jim Beam: original password is "staff1"
-- For Lisa Ray: original password is "staff2"
INSERT INTO Air_Control_Dep (username, email, password, first_name, last_name, phone_number, department)
VALUES
  ('control.jim', 'jim.control@example.com', '$pbkdf2-sha256$29000$GCNESEkJoRTiPMd4T8m5Nw$ZIwIAqLd9CIRU0UwNSEJQkV0ir7FOpqVp8l7/0ZyX58', 'Jim', 'Beam', '555-9876', 'Flight Operations'),
  ('control.lisa', 'lisa.control@example.com', '$pbkdf2-sha256$29000$W4uxlpLSWqu1Vup9T0npXQ$WJbwpiSMR/1pKnH4FmMhvpZkEwX0Au0KpbdBnvaT5AM', 'Lisa','Ray','555-9213','Scheduling');

-- Insert sample bookings (using flight_id 1 & 2 and user_id 1 & 2 respectively)
INSERT INTO Bookings (flight_id, seat_number, extra_baggage, travel_insurance, booking_status, total_price, user_id)
VALUES
  (1, '12A', 1, 0, 'confirmed', 350.00, 1),
  (2, '15B', 0, 1, 'confirmed', 400.00, 2);

-- Insert sample transactions (associating bookings with payment methods)
INSERT INTO Transaction (booking_id, amount, transaction_status, payment_method_id)
VALUES
  (1, 350.00, 'completed', 1),
  (2, 400.00, 'pending', 2);

-- Insert sample feedback (users providing ratings on flights)
INSERT INTO Feedback (flight_id, rating, comments, user_id)
VALUES
  (1, 4, 'Smooth flight with comfortable seating.', 1),
  (2, 3, 'Flight was delayed, but staff were courteous.', 2);

-- Insert sample air control activity logs
INSERT INTO Air_Control_Activity_Log (staff_id, activity_type, flight_id)
VALUES
  (1, 'Update Flight', 1),
  (2, 'Monitor Flight', 2);

-- Insert sample admin users
-- For admin1: original password is "admin1"
-- For admin2: original password is "admin2"
INSERT INTO Admin (username, email, password, first_name, last_name)
VALUES
  ('admin1', 'admin1@example.com', '$pbkdf2-sha256$29000$JWRMSel9r7U2RmgNwXhPKQ$po0BIdDojJ02a3gjnZkgkhfDQo11IOnt8mZ75xWdTKI', 'Alice', 'Admin'),
  ('admin2', 'admin2@example.com', '$pbkdf2-sha256$29000$BoDQ2lurFUKIca4Vwvi/Fw$pmk3UlhKmls7lozRvYn7ziLg4aOOAap9eV3p76nRGYI', 'Bob', 'Boss');

-- Insert sample admin activity logs
INSERT INTO Admin_Activity_Log (activity_type, description, admin_id)
VALUES
  ('System Update', 'Updated system settings for improved performance.', 1),
  ('User Management', 'Reviewed and updated user reports and statuses.', 2);

-- Insert sample management relationships (assigning air control staff to flights)
INSERT INTO manages (staff_id, flight_id)
VALUES
  (1, 1),
  (2, 2);

