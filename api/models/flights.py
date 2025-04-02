from DB import db

class Flight(db.Model):
    __tablename__ = 'Flights'
    flight_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flight_number = db.Column(db.String(20), nullable=False)
    airline = db.Column(db.String(100), nullable=False)
    departure_airport = db.Column(db.String(10), nullable=False)
    arrival_airport = db.Column(db.String(10), nullable=False)
    total_capacity = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    created_by = db.Column(db.Integer, nullable=False)

    # Relationships
    bookings = db.relationship('Booking', backref='flight', lazy=True)
    feedbacks = db.relationship('Feedback', backref='flight', lazy=True)
    activity_logs = db.relationship('AirControlActivityLog', backref='flight', lazy=True)