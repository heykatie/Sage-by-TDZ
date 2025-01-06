from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models.db import db
from app.models import Invites

invite_route = Blueprint('invites', __name__ )

@invite_route.route('/')
@login_required
def get_group_invites():
    group_id = request.args.get('group_id')
    if not group_id:
        return {"message": "Group ID is required"}, 400

    invites = Invites.query.filter_by(group_id=group_id).all()
    return {"invites": [invite.to_dict() for invite in invites]}, 200

# @invite_route.route('/')
# @login_required
# def user_invites():
#     """
#     Query all the invites sent
#     """

#     invites = Invites.query.all()

#     invites_list = []
#     for invite in invites:
#         invites_list.append({
#         'id': invite.id,
#         'user_id': invite.user_id,
#         'friend_id': invite.friend_id,
#         'group_id': invite.group_id,
#         'event_id': invite.event_id,
#         'created_at': invite.created_at,
#         'going': invite.going
#         })

#     return invites_list

@invite_route.route('/find')
@login_required
def find_invite():
    group_id = request.args.get('group_id')
    friend_id = request.args.get('friend_id')

    if not group_id or not friend_id:
        return ({"message": "Missing query parameters"}), 400

    invite = Invites.query.filter_by(group_id=group_id, friend_id=friend_id).first()

    print(f"Invite Query: {invite}")  # See what the query returns

    if invite:
        print(f"Found invite: {invite.to_dict()}")  # Log found invite
        return invite.to_dict(), 200
    else:
        print("Invite not found")  # Debug when invite is not found
        return {"message": "Invite not found"}, 404


@invite_route.route('/<int:user_id>')
@login_required
def group_invites(user_id):
    """
    Query all the invites of a user
    """

    invites = Invites.query.filter_by(user_id=user_id).all()

    if not invites:
        return {"message": "No invites found"}

    invites_list = []
    for invite in invites:
        invites_list.append({
        'id': invite.id,
        'user_id': invite.user_id,
        'friend_id': invite.friend_id,
        'group_id': invite.group_id,
        'event_id': invite.event_id,
        'created_at': invite.created_at,
        'going': invite.going
        })

    return invites_list


# @invite_route.route('/create', methods=['POST'])
# @login_required
# def create_invite():
#     """
#     Create a new invite?
#     """
#     invite = request.json

#     new_invite = Invites(**invite)

#     db.session.add(new_invite)

#     db.session.commit()

#     return new_invite.to_dict()

@invite_route.route('/create', methods=['POST'])
@login_required
def create_invite():
    """
    Create a new invite
    """
    try:
        invite_data = request.get_json()

        if not invite_data:
            return {"message": "Invalid request body"}, 400

        print("Request data:", invite_data)

        # Check required fields
        if not all(key in invite_data for key in ['group_id', 'user_id']):
            return {"message": "Missing required fields"}, 400

        new_invite = Invites(**invite_data)
        db.session.add(new_invite)
        db.session.commit()

        return new_invite.to_dict(), 201

    except Exception as e:
        print(f"Error creating invite: {e}")  # Log the error in the console
        return {"message": "Internal server error"}, 500


@invite_route.route('/<int:invite_id>', methods=['PUT'])
@login_required
def update_invite(invite_id):
    """
    Update an invite either the response of the invite you received changes going
    or and invite you have sent for a group
    """
    data = request.json
    invite = Invites.query.get(invite_id)

    if not invite:
        return { 'message': 'Invite not found'}, 404

    if 'going' in data and invite.friend_id == current_user.id:
        invite.going = data['going'] # Update the response to an invite you have received

    # if 'group_id' in data and invite.user_id == current_user.id:
    #     invite.group_id = data['group_id']

    db.session.commit()

    return invite.to_dict()


@invite_route.route('/<int:invite_id>', methods=['DELETE'])
@login_required
def delete_invite(invite_id):
    """
    Delete an invite by id for the logged-in user
    """
    invite = Invites.query.get(invite_id)

    if not invite:
        return { 'message': 'Invite not found'}, 404

    if invite.user_id != current_user.id:
        return { 'message': 'Permission denied'}, 403

    db.session.delete(invite)
    db.session.commit()

    return { 'message': 'Invite deleted successfully' }