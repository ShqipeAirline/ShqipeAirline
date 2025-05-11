# resources/admin.py
import os
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from marshmallow import Schema, fields
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import (
    jwt_required, get_jwt, get_jwt_identity
)

from DB import db
from models import Admin, AdminActivityLog
from schemas import (
    PlainAdminSchema, AdminUpdateSchema,
    PlainAdminActivityLogSchema
)

# --- helper to restrict to admins only ---
def admin_required():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="Admin privileges required.")

# --- Admin endpoints ---
admin_blp = Blueprint(
    "Admins", "admins", description="Operations on admin users"
)

@admin_blp.route("/admin")
class AdminList(MethodView):
    @jwt_required()
    @admin_blp.response(200, PlainAdminSchema(many=True))
    def get(self):
        admin_required()
        return Admin.query.all()

    @jwt_required()
    @admin_blp.arguments(PlainAdminSchema)
    @admin_blp.response(201, PlainAdminSchema)
    def post(self, admin_data):
        admin_required()
        # check uniques
        if Admin.query.filter_by(username=admin_data["username"]).first():
            abort(409, message="Username already exists.")
        if Admin.query.filter_by(email=admin_data["email"]).first():
            abort(409, message="Email already exists.")
        # hash password
        admin_data["password"] = pbkdf2_sha256.hash(admin_data["password"])
        admin = Admin(**admin_data)
        db.session.add(admin)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not create admin.")
        return admin

@admin_blp.route("/admin/<int:admin_id>")
class AdminDetail(MethodView):
    @jwt_required()
    @admin_blp.response(200, PlainAdminSchema)
    def get(self, admin_id):
        admin_required()
        return Admin.query.get_or_404(admin_id)

    @jwt_required()
    @admin_blp.arguments(AdminUpdateSchema)
    @admin_blp.response(200, PlainAdminSchema)
    def put(self, update_data, admin_id):
        admin_required()
        admin = Admin.query.get_or_404(admin_id)
        if "password" in update_data:
            update_data["password"] = pbkdf2_sha256.hash(update_data["password"])
        for key, val in update_data.items():
            setattr(admin, key, val)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not update admin.")
        return admin

    @jwt_required()
    def delete(self, admin_id):
        admin_required()
        admin = Admin.query.get_or_404(admin_id)
        try:
            db.session.delete(admin)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete admin.")
        return {"message": "Admin deleted."}, 200

# --- Activity Log endpoints ---
log_blp = Blueprint(
    "AdminActivityLogs", "admin_activity_logs",
    description="Operations on admin activity logs"
)

@log_blp.route("/activity_logs")
class ActivityLogList(MethodView):
    @jwt_required()
    @log_blp.response(200, PlainAdminActivityLogSchema(many=True))
    def get(self):
        admin_required()
        return AdminActivityLog.query.all()

    @jwt_required()
    @log_blp.arguments(PlainAdminActivityLogSchema)
    @log_blp.response(201, PlainAdminActivityLogSchema)
    def post(self, log_data):
        admin_required()
        # ensure admin exists
        if not Admin.query.get(log_data["admin_id"]):
            abort(404, message="Admin not found.")
        log = AdminActivityLog(**log_data)
        db.session.add(log)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not create activity log.")
        return log

@log_blp.route("/activity_logs/<int:log_id>")
class ActivityLogDetail(MethodView):
    @jwt_required()
    @log_blp.response(200, PlainAdminActivityLogSchema)
    def get(self, log_id):
        admin_required()
        return AdminActivityLog.query.get_or_404(log_id)

    @jwt_required()
    def delete(self, log_id):
        admin_required()
        log = AdminActivityLog.query.get_or_404(log_id)
        try:
            db.session.delete(log)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete activity log.")
        return {"message": "Log deleted."}, 200
