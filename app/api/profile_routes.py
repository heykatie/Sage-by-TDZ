from flask import Blueprint, jsonify, request
from app.models.db import db
from app.models import User, Event, Feedback, RSVP
from app.forms import ProfileForm
from flask_login import current_user, login_required
import datetime

profile_routes = Blueprint('profile', __name__)

@profile_routes.route('/')
@login_required
def badges():
    user_id = current_user.get_id()
    currentDate = datetime.datetime.now().strftime("%Y-%m-%d")
    rsvps = RSVP.query.filter(RSVP.user_id == user_id)
    if rsvps:
        rsvpList = [rsvp.event_id for rsvp in rsvps]
        events = [Event.query.get(eventId) for eventId in rsvpList]
        pastEvents = [event for event in events if currentDate > event.event_date]
        return [event.to_dict() for event in pastEvents]
    return {'errors': {'message': "No badges could be found"}}, 404

@profile_routes.route('/rsvps')
@login_required
def rsvps():
    user_id = current_user.get_id()
    currentDate = datetime.datetime.now().strftime("%Y-%m-%d")
    rsvps = RSVP.query.filter(RSVP.user_id == user_id)
    if rsvps:
        rsvpList = [rsvp.event_id for rsvp in rsvps]
        events = [Event.query.get(eventId)for eventId in rsvpList]
        upcomingEvents = [event for event in events if currentDate < event.event_date]
        return {'rsvps': [event.to_dict() for event in upcomingEvents] }
    return {'errors': {'message': "No RSVPS could be found"}}, 404

@profile_routes.route('/edit', methods=["PATCH"])
@login_required
def edit_profile():
    form = ProfileForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user_id = current_user.get_id()
        user = User.query.get(user_id)

        user.username = form.data['username']
        user.email = form.data['email']
        user.password = form.data['password']
        user.address = form.data['address']
        user.city = form.data['city']
        user.state = form.data['state']

        db.session.commit()
        return user.to_dict()
    return form.errors, 401

@profile_routes.route('/delete', methods=['DELETE'])
@login_required
def delete_profile():
    user = User.query.get(current_user.get_id())
    if user:
        db.session.delete(user)
        db.session.commit()
        return { 'message': "Successfully deleted" }

    return {'errors': {'message': "User could not be found"}}, 404

@profile_routes.route('/events')
@login_required
def user_events():
    rsvps = RSVP.query.filter_by(user_id=current_user.id).all()
    events = [Event.query.get(rsvp.event_id).to_dict() for rsvp in rsvps]
    return {'events': events}
# def user_events():
#     user_events = RSVP.query.filter_by(user_id=current_user.id).all()
#     return {'events': [event.to_dict() for event in user_events]}

@profile_routes.route('/badges')
@login_required
def user_badges():
    return {'badges': current_user.badges}

@profile_routes.route('/feedback')
@login_required
def feedback():
    feedback = Feedback.query.filter(Feedback.user_id == current_user.get_id()).all()
    if feedback:
        return {'feedback': [f.to_dict() for f in feedback] }
    return {'errors': {'message': "No feedback found"}}, 404