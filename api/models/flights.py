from DB import db

class Flight(db.Model):
    __tablename__ = 'Flights'
    flight_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flight_number = db.Column(db.String(20), nullable=False)
    airline = db.Column(db.String(100), nullable=False)
    departure_airport = db.Column(db.String(10), nullable=False)
    departure_country = db.Column(db.String(100), nullable=False)
    arrival_airport = db.Column(db.String(10), nullable=False)
    arrival_country = db.Column(db.String(100), nullable=False)
    departure_date = db.Column(db.Date, nullable=False)
    departure_time = db.Column(db.Time, nullable=False)
    arrival_time = db.Column(db.Time, nullable=False)
    total_capacity = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)  # Base price for economy class
    created_by = db.Column(db.Integer, nullable=True, default=1)  # Default to user ID 1 (admin)

    # Relationships with cascade delete
    bookings = db.relationship('Booking', backref='flight', lazy=True, cascade='all, delete-orphan')
    feedbacks = db.relationship('Feedback', backref='flight', lazy=True, cascade='all, delete-orphan')
    activity_logs = db.relationship('AirControlActivityLog', backref='flight', lazy=True, cascade='all, delete-orphan')