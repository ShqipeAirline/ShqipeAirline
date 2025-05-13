from flask.views       import MethodView
from flask_smorest     import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc    import SQLAlchemyError
from DB                import db
from models            import Booking, Feedback, PaymentMethod, Transaction, User
from schemas           import (
    PlainBookingSchema, BookingSchema,
    PlainFeedbackSchema, FeedbackSchema,
    PlainPaymentMethodSchema, PaymentMethodSchema,
    PlainTransactionSchema, TransactionSchema,
    UserUpdateSchema
)
blp = Blueprint("Passengers", __name__, description="Operations on users")

#
# ─── USER PROFILE ─────────────────────────────────────────────────────────────
#
@blp.route("/user/<int:user_id>")
class UserProfile(MethodView):
    @jwt_required()
    @blp.response(200, UserUpdateSchema)
    def get(self, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403, message="Not authorized to access this resource.")
        return User.query.get_or_404(user_id)

    @jwt_required()
    @blp.arguments(UserUpdateSchema)
    @blp.response(200, UserUpdateSchema)
    def put(self, user_data, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403, message="Not authorized to access this resource.")
        
        user = User.query.get_or_404(user_id)
        
        # Check if email is already taken by another user
        existing_user = User.query.filter(User.email == user_data["email"], User.user_id != user_id).first()
        if existing_user:
            abort(400, message="Email already in use")
        
        # Update user data
        for key, value in user_data.items():
            if value is not None:  # Only update fields that are provided
                setattr(user, key, value)
        
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not update user profile.")
        
        return user

#
# ─── USER’S BOOKINGS ───────────────────────────────────────────────────────────
#
@blp.route("/user/<int:user_id>/bookings")
class UserBookingList(MethodView):
    @jwt_required()
    @blp.response(200, BookingSchema(many=True))
    def get(self, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403, message="Not authorized to access this resource.")
        return Booking.query.filter_by(user_id=user_id).all()

    @jwt_required()
    @blp.arguments(PlainBookingSchema)
    @blp.response(201, BookingSchema)
    def post(self, booking_data, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403, message="Access forbidden.")
        booking_data["user_id"] = user_id
        booking = Booking(**booking_data) #TODO check if seat number lets say is relevant
        db.session.add(booking)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not create booking.")
        return booking

@blp.route("/user/<int:user_id>/bookings/<int:booking_id>")
class UserBookingDetail(MethodView):
    @jwt_required()
    @blp.response(200, BookingSchema)
    def get(self, user_id, booking_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        return Booking.query.filter_by(user_id=user_id, bookings_id=booking_id).first_or_404()

    @jwt_required()
    @blp.arguments(PlainBookingSchema)
    @blp.response(200, BookingSchema)
    def put(self, booking_data, user_id, booking_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        booking = Booking.query.filter_by(user_id=user_id, bookings_id=booking_id).first_or_404()
        for key, val in booking_data.items():
            setattr(booking, key, val)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not update booking.")
        return booking

    @jwt_required()
    def delete(self, user_id, booking_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        booking = Booking.query.filter_by(user_id=user_id, bookings_id=booking_id).first_or_404()
        db.session.delete(booking)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete booking.")
        return {"message": "Booking deleted."}, 200


#
# ─── USER’S FEEDBACKS ──────────────────────────────────────────────────────────
#
@blp.route("/user/<int:user_id>/feedbacks")
class UserFeedbackList(MethodView):
    @jwt_required()
    @blp.response(200, FeedbackSchema(many=True))
    def get(self, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        return Feedback.query.filter_by(user_id=user_id).all()

    @jwt_required()
    @blp.arguments(PlainFeedbackSchema)
    @blp.response(201, FeedbackSchema)
    def post(self, feedback_data, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        feedback_data["user_id"] = user_id
        fb = Feedback(**feedback_data)
        db.session.add(fb)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not create feedback.")
        return fb

@blp.route("/user/<int:user_id>/feedbacks/<int:feedback_id>")
class UserFeedbackDetail(MethodView):
    @jwt_required()
    @blp.response(200, FeedbackSchema)
    def get(self, user_id, feedback_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        return Feedback.query.filter_by(user_id=user_id, feedback_id=feedback_id).first_or_404()

    @jwt_required()
    @blp.arguments(PlainFeedbackSchema)
    @blp.response(200, FeedbackSchema)
    def put(self, feedback_data, user_id, feedback_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        fb = Feedback.query.filter_by(user_id=user_id, feedback_id=feedback_id).first_or_404()
        for key, val in feedback_data.items():
            setattr(fb, key, val)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not update feedback.")
        return fb

    @jwt_required()
    def delete(self, user_id, feedback_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        fb = Feedback.query.filter_by(user_id=user_id, feedback_id=feedback_id).first_or_404()
        db.session.delete(fb)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete feedback.")
        return {"message": "Feedback deleted."}, 200


#
# ─── USER’S PAYMENT METHODS ───────────────────────────────────────────────────
#
@blp.route("/user/<int:user_id>/payment_methods")
class UserPaymentMethodList(MethodView):
    @jwt_required()
    @blp.response(200, PaymentMethodSchema(many=True))
    def get(self, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        return PaymentMethod.query.filter_by(user_id=user_id).all()

    @jwt_required()
    @blp.arguments(PlainPaymentMethodSchema)
    @blp.response(201, PaymentMethodSchema)
    def post(self, pm_data, user_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        pm_data["user_id"] = user_id
        pm = PaymentMethod(**pm_data)
        db.session.add(pm)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not add payment method.")
        return pm

@blp.route("/user/<int:user_id>/payment_methods/<int:pm_id>")
class UserPaymentMethodDetail(MethodView):
    @jwt_required()
    @blp.response(200, PaymentMethodSchema)
    def get(self, user_id, pm_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        return PaymentMethod.query.filter_by(user_id=user_id, payment_method_id=pm_id).first_or_404()

    @jwt_required()
    @blp.arguments(PlainPaymentMethodSchema)
    @blp.response(200, PaymentMethodSchema)
    def put(self, pm_data, user_id, pm_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        pm = PaymentMethod.query.filter_by(user_id=user_id, payment_method_id=pm_id).first_or_404()
        for key, val in pm_data.items():
            setattr(pm, key, val)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not update payment method.")
        return pm

    @jwt_required()
    def delete(self, user_id, pm_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        pm = PaymentMethod.query.filter_by(user_id=user_id, payment_method_id=pm_id).first_or_404()
        db.session.delete(pm)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete payment method.")
        return {"message": "Payment method removed."}, 200


#
# ─── USER’S TRANSACTIONS ───────────────────────────────────────────────────────
#  (nested under a payment method)
#
@blp.route("/user/<int:user_id>/payment_methods/<int:pm_id>/transactions")
class UserTransactionList(MethodView):
    @jwt_required()
    @blp.response(200, TransactionSchema(many=True))
    def get(self, user_id, pm_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        return Transaction.query.filter_by(payment_method_id=pm_id).all()

    @jwt_required()
    @blp.arguments(PlainTransactionSchema)
    @blp.response(201, TransactionSchema)
    def post(self, tx_data, user_id, pm_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        tx_data["payment_method_id"] = pm_id
        tx = Transaction(**tx_data)
        db.session.add(tx)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not create transaction.")
        return tx

@blp.route("/user/<int:user_id>/payment_methods/<int:pm_id>/transactions/<int:tx_id>")
class UserTransactionDetail(MethodView):
    @jwt_required()
    @blp.response(200, TransactionSchema)
    def get(self, user_id, pm_id, tx_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        return Transaction.query.filter_by(
            payment_method_id=pm_id, transaction_id=tx_id
        ).first_or_404()

    @jwt_required()
    def delete(self, user_id, pm_id, tx_id):
        if int(get_jwt_identity()) != int(user_id):
            abort(403)
        tx = Transaction.query.filter_by(
            payment_method_id=pm_id, transaction_id=tx_id
        ).first_or_404()
        db.session.delete(tx)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Could not delete transaction.")
        return {"message": "Transaction deleted."}, 200
