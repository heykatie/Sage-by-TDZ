from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import User, Group, RSVP, Invites, Message, Event
from app.models.db import db
from sqlalchemy import and_

group_routes = Blueprint('groups', __name__)

# @group_routes.route('/')
# @login_required
# def get_user_groups():
#     """
#     Get all groups the current user is in.
#     """

#     # groups = Invites.query.filter(Invites.going and Invites.user_id == current_user.id).all()
#     groups = Invites.query.filter(and_(Invites.going == True, Invites.user_id == current_user.id)).all()
#     if not groups:
#         return {"message": "No groups could be found"}, 404
#     return {"Groups": [group.to_dict() for group in groups]}

from app.models import User

@group_routes.route('/')
def get_user_groups():
    if not current_user.is_authenticated:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = current_user.id

    # Get all groups where the user is the owner or invited with going=True
    groups = (
        db.session.query(Group)
        .outerjoin(Invites, Group.id == Invites.group_id)
        .filter(
            (Group.owner_id == user_id) |  # Groups where the user is the owner
            ((Invites.friend_id == user_id) & (Invites.going == True))  # Groups where the user is marked as going
        )
        .all()
    )

    group_list = []
    for group in groups:
        # Get invites for this group where going=True
        invites = (
            db.session.query(Invites)
            .filter_by(group_id=group.id, going=True)
            .all()
        )

        # Get user details for each `friend_id` in the invites
        friend_ids = [invite.friend_id for invite in invites]
        friends = (
            db.session.query(User)
            .filter(User.id.in_(friend_ids))
            .all()
        )

        # Create member objects
        members = [{'id': friend.id, 'name': f'{friend.first_name} {friend.last_name}'} for friend in friends]

        group_data = {
            'id': group.id,
            'event_id': group.event_id,
            'owner_id': group.owner_id,
            'event_title': group.event.title if group.event else 'No event',
            'owner_name': f"{group.owner.first_name} {group.owner.last_name}" if group.owner else 'Unknown',
            'description': group.description or 'No description provided.',
            'members': members,
            'membersCount': len(members),
        }

        group_list.append(group_data)

    return jsonify({'Groups': group_list})

@group_routes.route('/<int:groupId>')
@login_required
def get_group_details(groupId):
    """
    Get details of a specific group.
    """
    group = Group.query.get(groupId)
    if not group:
        return {"message": "Group not found"}, 404
    return group.to_dict()

@group_routes.route('/<int:group_id>/invites', methods=['GET'])
@login_required
def get_group_invites(group_id):
    invites = Invites.query.filter_by(group_id=group_id).all()
    if not invites:
        return {"message": "No invites found"}, 404
    return {"invites": [invite.to_dict() for invite in invites]}, 200

@group_routes.route('/', methods=['POST'])
@login_required
def create_group():
    """
    Create a new group.
    """
    data = request.get_json()
    event_id = data.get("eventId")
    description = data.get("description", "")  # Optional description

    if not event_id:
        return {
            "message": "Bad Request",
            "errors": {"eventId": "Event choice is required"}
        }, 400

    # Create a new group instance
    new_group = Group(
        event_id=event_id,
        owner_id=current_user.id,
        description=description  # Add description
    )
    db.session.add(new_group)
    db.session.commit()

    return new_group.to_dict(), 201

@group_routes.route('/<int:groupId>', methods=['DELETE'])
@login_required
def delete_group(groupId):
    """
    Delete a group. Only the creator can delete it.
    """
    group = Group.query.get(groupId)
    if not group:
        return {"message": "Group not found"}, 404
    if group.owner_id != current_user.id:
        return {"message": "Unauthorized"}, 403

    db.session.delete(group)
    db.session.commit()
    return {"message": "Successfully deleted group"}

@group_routes.route('/<int:groupId>', methods=['PUT'])
@login_required
def update_group(groupId):
    data = request.get_json()
    group = Group.query.get(groupId)
    if not group:
        return {"message": "Group not found"}, 404

    # Update fields like description, eventId, etc.
    group.description = data.get('description', group.description)
    group.event_id = data.get('eventId', group.event_id)
    db.session.commit()

    return group.to_dict(), 200

@group_routes.route('/<int:groupId>/members')
@login_required
def get_group_members(groupId):
    """
    Get all members of a specific group.
    """
    group = Group.query.get(groupId)
    if not group:
        return {"message": "Group not found"}, 404

    members = User.query.join(RSVP, (RSVP.user_id == User.id) & (RSVP.event_id == group.event_id)).all()
    # members = User.query.join(RSVP, RSVP.user_id == User.id).filter(
    #     RSVP.event_id == group.event_id
    # ).all()

    return {"Members": [member.to_dict() for member in members]}

@group_routes.route('/<int:groupId>/messages')
@login_required
def get_all_messages(groupId):
    """
    Get all messages for a specific group.
    """
    group = Group.query.get(groupId)
    if not group:
        return {"message": "Group not found"}, 404

    # messages = Message.query.filter(Message.group_id == groupId).all()
    messages = Message.query.filter_by(group_id=groupId).all()
    if not messages:
        return {"messages": []}, 200

    return {"messages": [message.to_dict() for message in messages]}, 200

# def get_all_messages(groupId):
#     messages = Message.query.filter(Message.group_id == groupId)
#     members = get_group_members(groupId)['Members']
#     # member = [member for member in members if member['id'] == current_user.id]
#     members = [member for member in get_group_members(groupId) if member['id'] == current_user.id]
#     if messages and members:
#         return {'messages': [message.to_dict() for message in messages]}

#     return { 'error': { 'message': 'No messages found' } }

@group_routes.route('/<int:groupId>/messages', methods=['POST'])
@login_required
def create_message(groupId):
    members = get_group_members(groupId)['Members']
    member = [member for member in members if member['id'] == current_user.id]
    if not member:
        return { 'error': { 'message': 'Not a member of this group.' } }

    data = request.get_json()
    message = data.get('message')

    if not message:
        return {"error": "Message cannot be empty"}, 400

    newMessage = Message(
        group_id=groupId,
        user_id=current_user.get_id(),
        message=message
    )

    db.session.add(newMessage)
    db.session.commit()
    return newMessage.to_dict(), 201

# @group_routes.route('/<int:groupId>/messages/<int:messageId>')
# @login_required
# def edit_messages(groupId, messageId):
    # message = Message.query.get(messageId)

    # allMessages = get_all_messages(groupId)['messages']
    # if not allMessages:
    #     return { 'errors': { 'message': 'No messages found.' } }
    # message = [message for message in allMessages if message['id'] == messageId]
    # if not message:
    #     return { 'errors': {'message': 'No message found.' } }
    # data = request.get_json()
    # editedMessage = data.get("message")
    # orginalMessage = Message.query.get(messageId)
    # return message.to_dict()

# @group_routes.route('/<int:id>', methods=['DELETE'])
# @login_required
# def delete_message():