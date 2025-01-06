from flask_wtf import FlaskForm
from wtforms import SubmitField, SelectField
from wtforms_sqlalchemy.fields import QuerySelectField
from wtforms.validators import DataRequired, ValidationError
from app.models import Invites

# def friends_query_factory(event_id):
#     return User.query.join(RSVP).filter(RSVP.event_id == event_id, RSVP.going == True).all()

class InviteForm(FlaskForm):
    friends = SelectField('Select Friends', choices=[], coerce=int)
    going = SelectField('Going?', choices=[('YES!', True), ('No', False)])
    submit = SubmitField('Send Invite')