from flask import Blueprint, jsonify, request
from app.models import User, Request
from app.models.db import db
from flask_login import current_user, login_required
import datetime

request_routes = Blueprint('requests', __name__)

@request_routes.route('/')
@login_required
def get_sent_requests():
    sent_requests = Request.query.filter(Request.sender_id == current_user.get_id())
    received_requests = Request.query.filter(Request.receiver_id == current_user.get_id())
    def requestNormalizer(request):
        formattedRequest = {
            "accepted": request.accepted,
            "created_at": request.created_at,
            "id": request.id,
            "receiver_id": request.receiver_id,
            "sender_id": request.sender_id,
            "sender_name": User.query.get(request.sender_id).username,
            "receiver_name": User.query.get(request.receiver_id).username,
            "sender_pic": User.query.get(request.sender_id).profile_pic
        }
        return formattedRequest
    if not sent_requests and not received_requests:
        return { 'errors': { 'message': 'No requests found.' } }, 404
    return { 'sent_requests': [requestNormalizer(request) for request in sent_requests], 'received_requests': [requestNormalizer(request) for request in received_requests] }

@request_routes.route('/', methods=['POST'])
@login_required
def create_request():
    data = request.get_json()
    receiver_id = data['receiver_id']
    oldRequest = Request.query.filter(Request.sender_id == current_user.id and Request.receiver_id == receiver_id)
    if oldRequest:
        return { 'errors': {'message': 'A request already exists.'} }, 403

    newRequest = Request(
        sender_id=current_user.id,
        receiver_id=receiver_id,
    )

    db.session.add(newRequest)
    db.session.commit()
    return newRequest.to_dict()

@request_routes.route('/<int:request_id>', methods=['PUT'])
@login_required
def update_request(request_id):
    """
    Update an request either the response of the request you received changes going
    or and request you have sent for a group
    """
    data = request.json
    requests = Request.query.get(request_id)

    if not requests:
        return { 'message': 'Request not found'}, 404

    if 'accepted' in data and requests.receiver_id == current_user.id:
        requests.accepted = data['accepted'] # Update the response to an request you have received

    # if 'group_id' in data and invite.user_id == current_user.id:
    #     invite.group_id = data['group_id']

    db.session.commit()

    return requests.to_dict()



@request_routes.route('/<int:requestId>', methods=['DELETE'])
@login_required
def delete_request(requestId):
    request = Request.query.get(requestId)
    if not request or not request.sender_id == current_user.id:
        return { 'error': { 'massage': 'No request found.' } }, 404

    db.session.delete(request)
    db.session.commit()
    return { 'message': 'Request successfully deleted.' }
