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
    if not sent_requests and not received_requests:
        return { 'errors': { 'message': 'No requests found.' } }
    return { 'sent_requests': [request.to_dict() for request in sent_requests], 'received_requests': [request.to_dict() for request in received_requests] }

@request_routes.route('/', methods=['POST'])
@login_required
def create_request():
    data = request.get_json()
    receiver_id = data['receiver_id']
    oldRequest = Request.query.filter(Request.sender_id == current_user.id and Request.receiver_id == receiver_id)
    if oldRequest:
        return { 'errors': {'message': 'A request already exists.'} }

    newRequest = Request(
        sender_id=current_user.id,
        receiver_id=receiver_id,
    )

    db.session.add(newRequest)
    db.session.commit()
    return newRequest.to_dict()


@request_routes.route('/<int:requestId>', methods=['DELETE'])
@login_required
def delete_request(requestId):
    request = Request.query.get(requestId)
    if not request or not request.sender_id == current_user.id:
        return { 'error': { 'massage': 'No request found.' } }

    db.session.delete(request)
    db.session.commit()
    return { 'message': 'Request successfully deleted.' }
