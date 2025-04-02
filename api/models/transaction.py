from DB import db

class Transaction(db.Model):
    __tablename__ = 'Transaction'
    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    booking_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    transaction_status = db.Column(db.String(50), nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    payment_method_id = db.Column(db.Integer, db.ForeignKey('Payment_Methods.payment_method_id'), nullable=False)