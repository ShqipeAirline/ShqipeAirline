from marshmallow import Schema, fields, validate

# ---------------------
# Admin Schemas
# ---------------------
class PlainAdminSchema(Schema):
    admin_id   = fields.Int(dump_only=True)
    username   = fields.Str(required=True)
    email      = fields.Email(required=True)
    password   = fields.Str(required=True, load_only=True)
    first_name = fields.Str()
    last_name  = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    last_login = fields.DateTime(dump_only=True)

class AdminUpdateSchema(Schema):
    username   = fields.Str()
    email      = fields.Email()
    password   = fields.Str(load_only=True)
    first_name = fields.Str()
    last_name  = fields.Str()

class PlainAdminActivityLogSchema(Schema):
    log_id             = fields.Int(dump_only=True)
    activity_type      = fields.Str(required=True)
    description        = fields.Str()
    activity_timestamp = fields.DateTime(dump_only=True)
    admin_id           = fields.Int(required=True)

class AdminSchema(PlainAdminSchema):
    activity_logs = fields.List(
        fields.Nested(PlainAdminActivityLogSchema),
        dump_only=True
    )


# ---------------------
# Air Control Department Schemas
# ---------------------

class PlainAirControlDepSchema(Schema):
    staff_id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    phone_number = fields.Str()
    department = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    last_login = fields.DateTime(dump_only=True)

    admin_id = fields.Int(dump_only=True)
    deleted_at = fields.DateTime(dump_only=True)

class AirControlUpdateSchema(Schema):
    username = fields.Str()
    email = fields.Email()
    password = fields.Str(load_only=True)
    first_name = fields.Str()
    last_name = fields.Str()
    phone_number = fields.Str()
    department = fields.Str()

class PlainAirControlActivityLogSchema(Schema):
    ac_log_id = fields.Int(dump_only=True)
    activity_type = fields.Str(required=True)
    description = fields.Str()
    activity_timestamp = fields.DateTime(dump_only=True)
    staff_id = fields.Int()
    flight_id = fields.Int(required=True)

class AirControlActivityLogSchema(PlainAirControlActivityLogSchema):
    # Extended schema with nested staff and flight details
    staff = fields.Nested(PlainAirControlDepSchema, dump_only=True)
    flight = fields.Nested(lambda: PlainFlightSchema(), dump_only=True)

class AirControlDepSchema(PlainAirControlDepSchema):
    # Include activity logs and flights associated with the air control staff.
    activity_logs = fields.List(fields.Nested(PlainAirControlActivityLogSchema), dump_only=True)
    flights = fields.List(fields.Nested(lambda: PlainFlightSchema()), dump_only=True)

# ---------------------
# Flight Schemas
# ---------------------

class PlainFlightSchema(Schema):
    flight_id = fields.Int(dump_only=True)
    flight_number = fields.Str(required=True)
    airline = fields.Str(required=True)
    departure_airport = fields.Str(required=True)
    departure_country = fields.Str(required=True)
    arrival_airport = fields.Str(required=True)
    arrival_country = fields.Str(required=True)
    departure_date = fields.Date(required=True)
    departure_time = fields.Time(required=True)
    arrival_time = fields.Time(required=True)
    total_capacity = fields.Int(required=True)
    available_seats = fields.Int(required=True)
    status = fields.Str(required=True)
    base_price = fields.Decimal(places=2, required=True)  # Base price for economy class
    created_by = fields.Int(required=True)

class FlightSchema(PlainFlightSchema):
    bookings = fields.List(fields.Nested(lambda: PlainBookingSchema()), dump_only=True)
    feedbacks = fields.List(fields.Nested(lambda: PlainFeedbackSchema()), dump_only=True)
    activity_logs = fields.List(fields.Nested(lambda: PlainAirControlActivityLogSchema()), dump_only=True)


# ---------------------
# Booking Schemas
# ---------------------

class PlainBookingSchema(Schema):
    bookings_id = fields.Int(dump_only=True)
    flight_id = fields.Int(required=True)
    seat_number = fields.Str(required=True)
    extra_baggage = fields.Int(required=True)
    travel_insurance = fields.Int(required=True)
    booking_status = fields.Str(required=True)
    booking_date = fields.DateTime(dump_only=True)
    total_price = fields.Decimal(as_string=True, required=True)
    user_id = fields.Int()

class BookingSchema(PlainBookingSchema):
    flight = fields.Nested(PlainFlightSchema, dump_only=True)
    user = fields.Nested(lambda: PlainUserSchema(), dump_only=True)


# ---------------------
# Feedback Schemas
# ---------------------

class PlainFeedbackSchema(Schema):
    feedback_id = fields.Int(dump_only=True)
    flight_id = fields.Int(required=True)
    rating = fields.Int(required=True)
    comments = fields.Str()
    feedback_date = fields.DateTime(dump_only=True)
    user_id = fields.Int(required=True)

class FeedbackSchema(PlainFeedbackSchema):
    flight = fields.Nested(PlainFlightSchema, dump_only=True)
    user = fields.Nested(lambda: PlainUserSchema(), dump_only=True)

# ---------------------
# Payment Method and Transaction Schemas
# ---------------------

class PlainPaymentMethodSchema(Schema):
    payment_method_id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    payment_type = fields.Str(required=True)
    payment_token = fields.Str(required=True, load_only=True)
    card_last_four = fields.Str(required=True)
    card_brand = fields.Str()
    expiration_month = fields.Int()
    expiration_year = fields.Int()
    is_default = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class PaymentMethodSchema(PlainPaymentMethodSchema):
    transactions = fields.List(fields.Nested(lambda: PlainTransactionSchema()), dump_only=True)

class PlainTransactionSchema(Schema):
    transaction_id = fields.Int(dump_only=True)
    booking_id = fields.Int(required=True)
    amount = fields.Decimal(as_string=True, required=True)
    transaction_status = fields.Str(required=True)
    transaction_date = fields.DateTime(dump_only=True)
    payment_method_id = fields.Int(required=True)

class TransactionSchema(PlainTransactionSchema):
    payment_method = fields.Nested(PlainPaymentMethodSchema, dump_only=True)

# ---------------------
# User Schemas
# ---------------------

class PlainUserSchema(Schema):
    user_id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    phone_number = fields.Str()
    account_status = fields.Int(required=False)
    date_of_birth = fields.Date()
    created_at = fields.DateTime(dump_only=True)
    last_login = fields.DateTime(dump_only=True)

class UserSchema(PlainUserSchema):
    bookings = fields.List(fields.Nested(PlainBookingSchema), dump_only=True)
    feedbacks = fields.List(fields.Nested(PlainFeedbackSchema), dump_only=True)
    payment_methods = fields.List(fields.Nested(PlainPaymentMethodSchema), dump_only=True)

class UserUpdateSchema(Schema):
    user_id = fields.Int(dump_only=True)
    first_name = fields.Str()
    last_name = fields.Str()
    email = fields.Email()
    password = fields.Str(load_only=True)
    phone_number = fields.Str()
    account_status = fields.Int()
    date_of_birth = fields.Date()
    role = fields.Str()
