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
from datetime import datetime, timedelta
from flask import request

from DB import db
from models import Admin, AdminActivityLog, Flight, Transaction, Booking, User, Feedback
from schemas import (
    PlainAdminSchema, AdminUpdateSchema,
    PlainAdminActivityLogSchema, FeedbackSchema
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

# --- Dashboard Statistics endpoint ---
@admin_blp.route("/admin/dashboard/stats")
class DashboardStats(MethodView):
    @jwt_required()
    @admin_blp.response(200)
    def get(self):
        admin_required()
        try:
            # Get time range from query parameters
            time_range = request.args.get('range', 'month')
            
            # Calculate date range based on selected period
            now = datetime.utcnow()
            if time_range == 'week':
                start_date = now - timedelta(days=7)
            elif time_range == 'month':
                start_date = now - timedelta(days=30)
            elif time_range == '6months':
                start_date = now - timedelta(days=180)
            elif time_range == 'year':
                start_date = now - timedelta(days=365)
            else:
                start_date = now - timedelta(days=30)  # Default to month

            # Get flight statistics for the selected period
            completed_flights = Flight.query.filter(
                Flight.status == 'completed',
                Flight.departure_time >= start_date
            ).count()
            
            active_flights = Flight.query.filter(
                Flight.status.in_(['on-time', 'delayed']),
                Flight.departure_time >= start_date
            ).count()
            
            canceled_flights = Flight.query.filter(
                Flight.status == 'cancelled',
                Flight.departure_time >= start_date
            ).count()

            # Get revenue statistics for the selected period
            total_revenue = db.session.query(db.func.sum(Transaction.amount))\
                .filter(
                    Transaction.transaction_status == 'completed',
                    Transaction.transaction_date >= start_date
                )\
                .scalar() or 0

            # Get ticket sales for the selected period
            tickets_sold = Booking.query.filter(
                Booking.booking_status == 'confirmed',
                Booking.booking_date >= start_date
            ).count()

            # Get customer growth for the selected period
            new_users = User.query.filter(
                User.created_at >= start_date
            ).count()
            
            total_users = User.query.filter(
                User.created_at <= now
            ).count()
            
            customer_growth = (new_users / total_users * 100) if total_users > 0 else 0

            # Get ticket sales data for the period
            monthly_tickets = db.session.query(
                db.func.date_format(Booking.booking_date, '%Y-%m'),
                db.func.count(Booking.bookings_id)
            ).filter(
                Booking.booking_date >= start_date,
                Booking.booking_status == 'confirmed'
            ).group_by(
                db.func.date_format(Booking.booking_date, '%Y-%m')
            ).all()

            # Get revenue data for the period
            monthly_revenue = db.session.query(
                db.func.date_format(Transaction.transaction_date, '%Y-%m'),
                db.func.sum(Transaction.amount)
            ).filter(
                Transaction.transaction_date >= start_date,
                Transaction.transaction_status == 'completed'
            ).group_by(
                db.func.date_format(Transaction.transaction_date, '%Y-%m')
            ).all()

            # Get popular destinations for the period
            popular_destinations = db.session.query(
                Flight.arrival_country,
                db.func.count(Booking.bookings_id)
            ).join(
                Booking, Flight.flight_id == Booking.flight_id
            ).filter(
                Booking.booking_status == 'confirmed',
                Booking.booking_date >= start_date
            ).group_by(
                Flight.arrival_country
            ).order_by(
                db.func.count(Booking.bookings_id).desc()
            ).limit(6).all()

            # Calculate percentages for destinations
            total_bookings = sum(dest[1] for dest in popular_destinations)
            destinations_with_percentages = [
                [dest[0], f"{round((dest[1] / total_bookings * 100))}%"]
                for dest in popular_destinations
            ] if total_bookings > 0 else []

            return {
                "completed_flights": completed_flights,
                "active_flights": active_flights,
                "canceled_flights": canceled_flights,
                "total_revenue": float(total_revenue),
                "tickets_sold": tickets_sold,
                "customer_growth": round(customer_growth, 2),
                "ticket_data": [
                    {"name": month, "tickets": count}
                    for month, count in monthly_tickets
                ],
                "revenue_data": [
                    {
                        "name": month,
                        "income": float(amount),
                        "expense": float(amount) * 0.4
                    }
                    for month, amount in monthly_revenue
                ],
                "popular_destinations": destinations_with_percentages
            }
        except SQLAlchemyError as e:
            db.session.rollback()
            abort(500, message=f"Error fetching dashboard statistics: {str(e)}")

# --- Transaction Management endpoints ---
@admin_blp.route("/admin/transactions")
class TransactionList(MethodView):
    @jwt_required()
    @admin_blp.response(200)
    def get(self):
        admin_required()
        try:
            # Get all transactions with related booking and user information
            transactions = db.session.query(
                Transaction,
                Booking,
                User,
                Flight
            ).join(
                Booking, Transaction.booking_id == Booking.bookings_id
            ).join(
                User, Booking.user_id == User.user_id
            ).join(
                Flight, Booking.flight_id == Flight.flight_id
            ).all()

            return [{
                "transaction_id": tx.Transaction.transaction_id,
                "booking_code": f"BK-{tx.Booking.bookings_id:06d}",
                "name": f"{tx.User.first_name} {tx.User.last_name}",
                "airline": tx.Flight.airline,
                "route": f"{tx.Flight.departure_airport}-{tx.Flight.arrival_airport}",
                "billing_date": tx.Transaction.transaction_date.strftime("%Y-%m-%d"),
                "amount": f"${float(tx.Transaction.amount):.2f}",
                "status": tx.Transaction.transaction_status
            } for tx in transactions]
        except SQLAlchemyError as e:
            db.session.rollback()
            abort(500, message=f"Error fetching transactions: {str(e)}")

    @jwt_required()
    @admin_blp.arguments(Schema.from_dict({
        "transaction_id": fields.Int(required=True),
        "status": fields.Str(required=True)
    }))
    @admin_blp.response(200)
    def put(self, update_data):
        admin_required()
        try:
            transaction = Transaction.query.get_or_404(update_data["transaction_id"])
            transaction.transaction_status = update_data["status"]
            db.session.commit()
            return {"message": "Transaction status updated successfully"}
        except SQLAlchemyError as e:
            db.session.rollback()
            abort(500, message=f"Error updating transaction: {str(e)}")

@admin_blp.route("/admin/transactions/<int:transaction_id>")
class TransactionDetail(MethodView):
    @jwt_required()
    def delete(self, transaction_id):
        admin_required()
        try:
            transaction = Transaction.query.get_or_404(transaction_id)
            # Also delete the associated booking if it exists
            booking = Booking.query.get(transaction.booking_id)
            if booking:
                db.session.delete(booking)
            db.session.delete(transaction)
            db.session.commit()
            return {"message": "Transaction and associated booking deleted successfully"}
        except SQLAlchemyError as e:
            db.session.rollback()
            abort(500, message=f"Error deleting transaction and booking: {str(e)}")

# --- Booking Management endpoints ---
@admin_blp.route("/admin/bookings/<int:booking_id>")
class AdminBookingDetail(MethodView):
    @jwt_required()
    @admin_blp.arguments(Schema.from_dict({
        "booking_status": fields.Str(required=True)
    }))
    @admin_blp.response(200)
    def put(self, update_data, booking_id):
        admin_required()
        try:
            booking = Booking.query.get_or_404(booking_id)
            booking.booking_status = update_data["booking_status"]
            db.session.commit()
            return {"message": "Booking status updated successfully"}
        except SQLAlchemyError as e:
            db.session.rollback()
            abort(500, message=f"Error updating booking: {str(e)}")

@admin_blp.route("/feedbacks")
class FeedbackList(MethodView):
    @jwt_required()
    @admin_blp.response(200, FeedbackSchema(many=True))
    def get(self):
        # Check if user is admin
        user = User.query.get_or_404(get_jwt_identity())
        if user.role != 'admin':
            abort(403, message="Not authorized to access this resource.")
        
        return Feedback.query.all()
