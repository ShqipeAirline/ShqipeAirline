import os
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from marshmallow import Schema, fields
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import (
    jwt_required, get_jwt, get_jwt_identity
)
from datetime import datetime

from DB import db
from models import Flight  # Ensure Flight is correctly imported from your models
from schemas import PlainFlightSchema, FlightSchema  # Adjust imports based on your schemas file

# Schema for updating flights (partial updates allowed)
class FlightUpdateSchema(Schema):
    flight_number = fields.Str()
    airline = fields.Str()
    departure_airport = fields.Str()
    arrival_airport = fields.Str()
    total_capacity = fields.Int()
    available_seats = fields.Int()
    status = fields.Str()

# Create a blueprint for Air Control Department flight operations
blp = Blueprint("AirControlFlights", "aircontrol", description="Operations for Air Control Department regarding flights")

def role_required():
    """
    Helper function to ensure that the JWT claims include a role of either
    'admin' or 'air control staff'.
    """
    claims = get_jwt()
    if claims.get("role") not in ["admin", "air control staff"]:
        abort(403, message="Access not allowed.")

# Route to list all flights and add a new flight
@blp.route("/flights")
class FlightList(MethodView):
    @jwt_required()
    @blp.response(200, PlainFlightSchema(many=True))
    def get(self):
        role_required()
        flights = Flight.query.all()
        return flights

    @jwt_required()
    @blp.arguments(PlainFlightSchema)
    @blp.response(201, FlightSchema)
    def post(self, flight_data):
        role_required()
        # Assign the flight's created_by field as the current user's identity.
        flight_data["created_by"] = get_jwt_identity()
        flight = Flight(**flight_data)
        db.session.add(flight)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Something went wrong when adding the flight.")
        return flight

# Route to get, update, or delete a specific flight
@blp.route("/flights/<int:flight_id>")
class FlightDetail(MethodView):
    @jwt_required()
    @blp.response(200, PlainFlightSchema)
    def get(self, flight_id):
        role_required()
        flight = Flight.query.get_or_404(flight_id)
        return flight

    @jwt_required()
    @blp.arguments(FlightUpdateSchema) #TODO : REmoved partial=True here
    @blp.response(200, FlightSchema)
    def put(self, flight_data, flight_id):
        role_required()
        flight = Flight.query.get_or_404(flight_id)
        for key, value in flight_data.items():
            setattr(flight, key, value)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Something went wrong when updating the flight.")
        return flight

    @jwt_required()
    def delete(self, flight_id):
        role_required()
        flight = Flight.query.get_or_404(flight_id)
        try:
            db.session.delete(flight)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Something went wrong when deleting the flight.")
        return {"message": "Flight deleted successfully."}, 200
