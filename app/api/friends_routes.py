from flask import Blueprint
from flask_login import login_required, current_user
from app.models import User, Request, RSVP, Event
from app.api.profile_routes import badges
import datetime
from sqlalchemy import or_
import re

friends_routes = Blueprint('friends', __name__)

@friends_routes.route('/')
@login_required
def get_all_friends():
    print(f"heyyy Current user: {current_user}")
    friend_ids = []
    sent_reqs = Request.query.filter(Request.sender_id == current_user.get_id(), Request.accepted == True)
    received_reqs = Request.query.filter(Request.receiver_id == current_user.get_id(), Request.accepted == True)
    all_reqs = {'sent': [req.to_dict() for req in sent_reqs], 'received': [req.to_dict() for req in received_reqs]}
    if not current_user.is_authenticated:
        print("User not authenticated!")
        return {'errors': ['User not authenticated']}, 401
    if all_reqs:
        # change this to a loop!
        [friend_ids.append(req['receiver_id']) for req in all_reqs['sent']]
        [friend_ids.append(req['sender_id']) for req in all_reqs['received']]
        return {'friends': [User.query.get(friend_id).to_dict() for friend_id in friend_ids] }
    return {'errors': {'message': "No friends found"}}

@friends_routes.route('/<int:friend_id>')
@login_required
def view_friend(friend_id):
    all_friends = get_all_friends()['friends']
    if all_friends:
        friend = [friend for friend in all_friends if friend['id'] == friend_id]
        if not friend:
            return {'errors': {'message': "Friend not found"}}
        return friend
    return {'errors': {'message': "Friend not found"}}

@friends_routes.route('/<int:friend_id>/events')
@login_required
def shared_events(friend_id):
    target_friend = view_friend(friend_id=friend_id)
    if type(target_friend) == list:
        def get_badges(id):
            userId = id
            currentDate = datetime.datetime.now().strftime("%Y-%m-%d")
            rsvps = RSVP.query.filter(RSVP.user_id == userId)
            if rsvps:
                rsvp_list = [rsvp.event_id for rsvp in rsvps]
                events = [Event.query.get(event_id) for event_id in rsvp_list]
                past_events = [event for event in events if currentDate > event.event_date]
                return [event.to_dict() for event in past_events]
        friend_badges = get_badges(friend_id)
        user_badges = get_badges(current_user.id)
        if not friend_badges:
            return {'errors': {'message': "No shared events found"}}, 404
        return [shared_badges for shared_badges in user_badges if shared_badges in friend_badges]

    return {'message': 'Friend not found'}, 404
