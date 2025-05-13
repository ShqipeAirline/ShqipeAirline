import requests, os
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from marshmallow import Schema, fields
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    get_jwt_identity, jwt_required, get_jwt
)
from flask import jsonify
from datetime import datetime

from DB import db
# Import all three models (adjust the names according to your models)
from models import User, Admin, AirControlDep
from schemas import PlainUserSchema
from blocklist import BLOCKLIST

# Login schema now only requires email and password
class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

blp = Blueprint("Users", "users", description="Operations on users")

def send_simple_message(to, subject, body):
    domain = os.getenv("MAILGUN_DOMAIN")
    return requests.post(
        f"https://api.mailgun.net/v3/{domain}/messages",
        auth=("api", os.getenv("MAILGUN_API_KEY")),
        data={
            "from": "Excited User <mailgun@sandboxfef3544c05b2459995a4f4cb4488d2a9.mailgun.org>",
            "to": [to],
            "subject": subject,
            "text": body
        }
    )

def admin_required():
    claims = get_jwt()
    if claims.get("role") != "admin":
        abort(403, message="Admin privileges required.")

# Registration and user-specific endpoints are only for regular users.
@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(PlainUserSchema)
    def post(self, user_data):
        if User.query.filter(User.email == user_data["email"]).first():
            abort(409, message="A user with that email already exists.")
        try:
            user = User(
                email=user_data["email"],
                password=pbkdf2_sha256.hash(user_data["password"]),
                first_name=user_data.get("first_name"),
                last_name=user_data.get("last_name"),
                phone_number=user_data.get("phone_number"),
            )
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Something went wrong when registering the user")
        return {"message": "User registered successfully."}, 201

@blp.route("/user/<int:user_id>")
class UserResource(MethodView):
    @jwt_required()
    @blp.response(200, PlainUserSchema)
    def get(self, user_id):
        user = User.query.get(user_id)
        return user

    @jwt_required()
    def delete(self, user_id):
        admin_required()
        user = User.query.get_or_404(user_id)
        try:
            db.session.delete(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(400, message="Something went wrong when deleting the user")
        return {"message": "User deleted successfully."}, 200

def get_identity(user):
    """
    Helper function to return the primary key from whichever model is used.
    Adjust attribute names if necessary.
    """
    if hasattr(user, "user_id"):
        return str(user.user_id)
    elif hasattr(user, "admin_id"):
        return str(user.admin_id)
    elif hasattr(user, "air_control_id"):
        return str(user.air_control_id)
    return None

@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(LoginSchema)
    def post(self, user_data):
        email = user_data["email"]
        password = user_data["password"]

        print(f"Login attempt for email: {email}")  # Debug log

        # Checking the admin table first.
        user = Admin.query.filter(Admin.email == email).first()
        role = "admin"
        if not user:
            # Then we check the air control department table.
            user = AirControlDep.query.filter(
                AirControlDep.email == email
            ).first()
            role = "air control staff"
        if not user:
            # Finally we check the regular users table.
            user = User.query.filter(User.email == email).first()
            role = "user"

        print(f"Found user: {user}, Role: {role}")  # Debug log

        if user and pbkdf2_sha256.verify(password, user.password):
            user.last_login = datetime.now()
            db.session.commit()
            identity = get_identity(user)
            
            if not identity:
                abort(500, message="Failed to generate user identity")
            
            # Include user data in the token claims
            additional_claims = {
                "role": role,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "user_id": user.user_id
            }
            
            print(f"Additional claims: {additional_claims}")  # Debug log
            
            access_token = create_access_token(identity=identity, fresh=True, additional_claims=additional_claims)
            
            # Prepare response data
            response_data = {
                "access_token": access_token,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "role": role
            }
            
            print(f"Response data: {response_data}")  # Debug log
            
            # Only regular users receive a refresh token !!!
            if role == "user":
                refresh_token = create_refresh_token(identity=identity, additional_claims=additional_claims)
                response_data["refresh_token"] = refresh_token
            
            # Convert response to JSON and print it
            response_json = jsonify(response_data)
            print(f"Final response: {response_json.get_data(as_text=True)}")
            
            return response_data, 200

        print("Invalid credentials")  # Debug log
        abort(401, message="Invalid credentials.")

#TODO revoke the refresh token too maybe???
@blp.route("/logout")
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"message": "Successfully logged out"}, 200

@blp.route("/refresh")
class TokenRefresh(MethodView):
    # Refresh endpoint applies only for regular users who have refresh tokens.
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        additional_claims = {"role": "user"}
        new_token = create_access_token(identity=current_user, fresh=False, additional_claims=additional_claims)
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"access_token": new_token}, 200
