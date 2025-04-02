from DB import db

class Feedback(db.Model):
    __tablename__ = 'Feedback'
    feedback_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    flight_id = db.Column(db.Integer, db.ForeignKey('Flights.flight_id'), nullable=False)
    rating = db.Column(db.SmallInteger, nullable=False)
    comments = db.Column(db.Text)
    feedback_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)