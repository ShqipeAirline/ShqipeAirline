from DB import db

class PaymentMethod(db.Model):
    __tablename__ = 'Payment_Methods'
    payment_method_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    payment_type = db.Column(db.String(50), nullable=False)
    payment_token = db.Column(db.String(255), nullable=False)
    card_last_four = db.Column(db.CHAR(4), nullable=False)
    card_brand = db.Column(db.String(50))
    expiration_month = db.Column(db.SmallInteger)
    expiration_year = db.Column(db.SmallInteger)
    is_default = db.Column(db.SmallInteger, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, onupdate=db.func.current_timestamp())

    # Relationships
    transactions = db.relationship('Transaction', backref='payment_method', lazy=True, cascade='all, delete-orphan')
    user = db.relationship('User', back_populates='payment_methods', lazy=True)
