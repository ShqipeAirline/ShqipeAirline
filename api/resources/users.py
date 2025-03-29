import requests,os
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from marshmallow import Schema,fields
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import create_access_token,create_refresh_token,get_jwt_identity, jwt_required, get_jwt
from flask import jsonify
from datetime import datetime

from DB import db
from models import UserModel
from schemas import PlainUserSchema
from blocklist import BLOCKLIST

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    user_type = fields.Str(required=False, missing="user")


blp = Blueprint("Users", "users", description="Operations on users")

def send_simple_message(to,subject,body):
    domain=os.getenv("MAILGUN_DOMAIN")

    return requests.post(
  		f"https://api.mailgun.net/v3/{domain}/messages",
  		auth=("api", os.getenv("MAILGUN_API_KEY")),
  		data={"from": "Excited User <mailgun@sandboxfef3544c05b2459995a4f4cb4488d2a9.mailgun.org>",
  			"to": [to],
  			"subject": subject,
  			"text": body})

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(PlainUserSchema)
    def post(self,user_data):
        print(user_data)
        if UserModel.query.filter(UserModel.email == user_data["email"]).first():
            abort(409, message="A user with that email already exists.")
        try:
            user = UserModel(
                email=user_data["email"],
                password=pbkdf2_sha256.hash(user_data["password"]),
                first_name=user_data.get("first_name"),
                last_name=user_data.get("last_name"),
                phone_number=user_data.get("phone_number"),
                emergency_contact_phone=user_data.get("emergency_contact_phone")
            )
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(400, message="Something went wrong when registering the user")

        return {"message": "User registered successfully."}, 201

@blp.route("/user/<int:user_id>")
class User(MethodView):
    @blp.response(200,PlainUserSchema)
    def get(self, user_id):
        user = UserModel.query.get(user_id)

        return user

    def delete(self, user_id):
        user = UserModel.query.get_or_404(user_id)

        try:
            db.session.delete(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(400,message="Something went wrong when deleting the user")

        return {"message": "User deleted successfully."} , 200

@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(LoginSchema)
    def post(self, user_data):
        user = UserModel.query.filter(UserModel.email == user_data["email"]).first()

        print(user)

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            user.last_login = datetime.now()
            db.session.commit()
            access_token = create_access_token(identity=user.user_id, fresh=True)
            refresh_token = create_refresh_token(user.user_id)
            return {"access_token": access_token, "refresh_token": refresh_token}, 200

        abort(401, message="Invalid credentials.")

@blp.route("/logout")
class UserLogout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"message": "Successfully logged out"}, 200

@blp.route("/refresh")
class TokenRefresh(MethodView):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        jti = get_jwt()["jti"]
        BLOCKLIST.add(jti)
        return {"access_token": new_token}, 200





