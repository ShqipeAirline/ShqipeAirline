from DB import db

class User(db.Model):
    __tablename__ = 'User'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(100),nullable=False,default='user')
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20))
    account_status = db.Column(db.SmallInteger, nullable=False, default=1)
    date_of_birth = db.Column(db.Date)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    last_login = db.Column(db.DateTime)

    # Relationships
    bookings = db.relationship('Booking', back_populates='user', lazy=True)
    feedbacks = db.relationship('Feedback', back_populates='user', lazy=True)
    payment_methods = db.relationship('PaymentMethod', back_populates='user', lazy=True)
