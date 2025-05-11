from DB import db

class AdminActivityLog(db.Model):
    __tablename__ = 'Admin_Activity_Log'
    log_id             = db.Column(db.Integer, primary_key=True, autoincrement=True)
    activity_type      = db.Column(db.String(50), nullable=False)
    description        = db.Column(db.Text)
    activity_timestamp = db.Column(
        db.DateTime,
        nullable=False,
        default=db.func.current_timestamp()
    )
    admin_id           = db.Column(
        db.Integer,
        db.ForeignKey('Admin.admin_id'),
        nullable=False
    )