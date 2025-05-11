from DB import db

class Booking(db.Model):
    __tablename__ = 'Bookings'
    bookings_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flight_id = db.Column(db.Integer, db.ForeignKey('Flights.flight_id'), nullable=False)
    seat_number = db.Column(db.String(10), nullable=False)
    extra_baggage = db.Column(db.SmallInteger, nullable=False, default=0)
    travel_insurance = db.Column(db.SmallInteger, nullable=False, default=0)
    booking_status = db.Column(db.String(50), nullable=False)
    booking_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    user = db.relationship('User', back_populates='bookings', lazy=True)
