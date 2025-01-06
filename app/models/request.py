from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime


class Request(db.Model):
    __tablename__ = 'requests'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    accepted = db.Column(db.Boolean, nullable=True)
    created_at = db.Column(db.String(255), default=datetime.datetime.now().strftime("%Y-%m-%d"))


    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'accepted': self.accepted,
            'created_at': self.created_at,
        }
