from marshmallow import Schema, fields

class PlainAdminSchema(Schema):
    admin_id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True)
    first_name = fields.Str()
    last_name = fields.Str()
    role = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    last_login = fields.DateTime(dump_only=True)

class PlainUserSchema(Schema):
    user_id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True)
    first_name = fields.Str()
    last_name = fields.Str()
    phone_number = fields.Str()
    emergency_contact_phone = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    last_login = fields.DateTime(dump_only=True)
    account_status = fields.Str()

class PlainStaffSchema(Schema):
    staff_id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True)
    first_name = fields.Str()
    last_name = fields.Str()
    department = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    last_login = fields.DateTime(dump_only=True)
