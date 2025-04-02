from DB import db

class AirControlActivityLog(db.Model):
    __tablename__ = 'Air_Control_Activity_Log'
    ac_log_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('Air_Control_Dep.staff_id'), nullable=False)
    activity_type = db.Column(db.String(100), nullable=False)
    activity_timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    flight_id = db.Column(db.Integer, db.ForeignKey('Flights.flight_id'), nullable=False)