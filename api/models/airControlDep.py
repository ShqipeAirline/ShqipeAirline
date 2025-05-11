from DB import db

# Many-to-many association table for AirControlDep and Flight
manages = db.Table(
    'manages',
    db.Column('staff_id', db.Integer, db.ForeignKey('Air_Control_Dep.staff_id'), primary_key=True),
    db.Column('flight_id', db.Integer, db.ForeignKey('Flights.flight_id'), primary_key=True)
)

class AirControlDep(db.Model):
    __tablename__ = 'Air_Control_Dep'
    staff_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100),nullable=False,default='air control staff')
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20))
    department = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    last_login = db.Column(db.DateTime)
    deleted_at = db.Column(
            db.DateTime,
            nullable = True,
            default = None)

    # Relationships
    activity_logs = db.relationship('AirControlActivityLog', backref='staff', lazy=True)
    # Many-to-many relationship with Flight using the 'manages' association table
    flights = db.relationship('Flight', secondary=manages, backref=db.backref('air_control_staff', lazy='dynamic'))
    admin_id = db.Column(
                db.Integer,
                db.ForeignKey('Admin.admin_id'),
                nullable = False)

