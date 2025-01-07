from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def email_exists(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


class EditProfileForm(FlaskForm):
    first_name = StringField(
        'username', validators=[])
    email = StringField('email', validators=[])
    last_name = StringField('password', validators=[])
    address = StringField('address', validators=[])
    city = StringField('city', validators=[])
    state = StringField('state', validators=[])
