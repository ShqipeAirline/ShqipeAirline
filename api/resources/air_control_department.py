# resources/aircontrol.py

from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

from DB import db
from models import AirControlDep, AirControlActivityLog, Flight
from schemas import (
    PlainAirControlDepSchema,
    AirControlUpdateSchema,
    AirControlDepSchema,
    PlainAirControlActivityLogSchema,
    PlainFlightSchema
)
from resources.admin import admin_required

blp = Blueprint(
    "AirControl", __name__, description="Air Control Dept operations"
)

#
# AirControlDep CRUD (soft delete + admin metadata)
#
@blp.route("/aircontrol")
class AirControlList(MethodView):
    @jwt_required()
    @blp.response(200, AirControlDepSchema(many=True))
    def get(self):
        admin_required()
        return AirControlDep.query.filter(AirControlDep.deleted_at.is_(None)).all()

    @jwt_required()
    @blp.arguments(PlainAirControlDepSchema)
    @blp.response(201, AirControlDepSchema)
    def post(self, ac_data):
        admin_required()
        ac_data["admin_id"] = get_jwt_identity()
        # hash incoming password
        ac_data["password"] = pbkdf2_sha256.hash(ac_data["password"])
        ac = AirControlDep(**ac_data)
        db.session.add(ac)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not create Air Control account.")
        return ac

@blp.route("/aircontrol/<int:staff_id>")
class AirControlDetail(MethodView):
    @jwt_required()
    @blp.response(200, AirControlDepSchema)
    def get(self, staff_id):
        admin_required()
        return AirControlDep.query.get_or_404(staff_id)

    @jwt_required()
    @blp.arguments(AirControlUpdateSchema)
    @blp.response(200, AirControlDepSchema)
    def put(self, ac_data, staff_id):
        admin_required()
        ac = AirControlDep.query.get_or_404(staff_id)

        for key, val in ac_data.items():
            setattr(ac, key, val)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not update Air Control account.")
        return ac

    @jwt_required()
    def delete(self, staff_id):
        admin_required()
        ac = AirControlDep.query.get_or_404(staff_id)
        ac.deleted_at = datetime.utcnow()
        try:
            db.session.delete(ac)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete Air Control account.")
        return {"message": "Account soft‑deleted."}, 200

#
# Activity log endpoints
#
@blp.route("/aircontrol/<int:staff_id>/activity_logs")
class ActivityLogList(MethodView):
    @jwt_required()
    @blp.response(200, PlainAirControlActivityLogSchema(many=True))
    def get(self, staff_id):
        admin_required()
        AirControlDep.query.get_or_404(staff_id)
        return AirControlActivityLog.query.filter_by(staff_id=staff_id).all()

    @jwt_required()
    @blp.arguments(PlainAirControlActivityLogSchema)
    @blp.response(201, PlainAirControlActivityLogSchema)
    def post(self, log_data, staff_id):
        admin_required()
        # verify flight exists
        if not Flight.query.get(log_data["flight_id"]):
            abort(404, message="Flight not found.")
        log = AirControlActivityLog(staff_id=staff_id,**log_data)
        db.session.add(log)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not create activity log.")
        return log

@blp.route("/aircontrol/<int:staff_id>/activity_logs/<int:log_id>")
class ActivityLogDetail(MethodView):
    @jwt_required()
    @blp.response(200, PlainAirControlActivityLogSchema)
    def get(self, staff_id, log_id):
        admin_required()
        AirControlDep.query.get_or_404(staff_id)
        return AirControlActivityLog.query.filter_by(
            staff_id=staff_id, ac_log_id=log_id
        ).first_or_404()

    @jwt_required()
    def delete(self, staff_id, log_id):
        admin_required()
        AirControlDep.query.get_or_404(staff_id)
        log = AirControlActivityLog.query.filter_by(
            staff_id=staff_id, ac_log_id=log_id
        ).first_or_404()
        db.session.delete(log)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete activity log.")
        return {"message": "Log deleted."}, 200

#
# Flight assignment endpoints
#
@blp.route("/aircontrol/<int:staff_id>/flights")
class StaffFlights(MethodView):
    @jwt_required()
    @blp.response(200, PlainFlightSchema(many=True))
    def get(self, staff_id):
        admin_required()
        staff = AirControlDep.query.get_or_404(staff_id)
        return staff.flights

@blp.route("/aircontrol/<int:staff_id>/flights/<int:flight_id>")
class StaffFlightManage(MethodView):
    @jwt_required()
    def post(self, staff_id, flight_id):
        admin_required()
        staff = AirControlDep.query.get_or_404(staff_id)
        flight = Flight.query.get_or_404(flight_id)
        staff.flights.append(flight)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not assign flight.")
        return {"message": "Flight assigned."}, 200

    @jwt_required()
    def delete(self, staff_id, flight_id):
        admin_required()
        staff = AirControlDep.query.get_or_404(staff_id)
        flight = Flight.query.get_or_404(flight_id)
        if flight not in staff.flights:
            abort(404, message="Flight not assigned.")
        staff.flights.remove(flight)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not unassign flight.")
        return {"message": "Flight unassigned."}, 200
