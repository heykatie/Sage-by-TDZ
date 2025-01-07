from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models.db import db
from app.models import RSVP, Feedback

rsvp_routes = Blueprint('rsvps', __name__)

@rsvp_routes.route('/', methods=['POST'])
@login_required
def add_rsvp(event_id):
    user_id = current_user.get_id()
    rsvp = RSVP(
        event_id=event_id,
        user_id=user_id
    )
    db.session.add(rsvp)
    db.session.commit()
    return rsvp.to_dict(), 201

@rsvp_routes.route('/delete', methods=['DELETE'])
@login_required
def delete_rsvp(id):
    userId = current_user.get_id()
    rsvp = RSVP.query.filter_by(RSVP.event_id == id, RSVP.user_id == userId)
    if rsvp:
        db.session.delete(rsvp)
        db.session.commit()
        return { 'message': "Successfully deleted" }
    return {'errors': {'message': "No RSVPS could be found"}}, 404

@rsvp_routes.route('/feedback', methods=['POST'])
@login_required
def add_feedback():
    userId = current_user.get_id()
    data=request.json()
    feedbackList = Feedback.query.filter(Feedback.organizer_id == id and Feedback.user_id == userId)

    if not feedbackList:
        feedback = Feedback(
        organizer_id=data['organizer_id'],
        user_id=userId,
        reaction=data['reaction']
        )
        db.session.add(feedback)
        db.session.commit()
        return feedback.to_dict(), 201
    return {'errors': {'message': "You have already left feedback for this organizer."}}, 403