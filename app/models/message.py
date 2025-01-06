from .db import db, environment, SCHEMA, add_prefix_for_prod
import datetime


class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id')), nullable=False)
    message = db.Column(db.String(1000), nullable=False)
    created_at = db.Column(db.String(255), default=datetime.datetime.now().strftime("%Y-%m-%d"))
    updated_at = db.Column(db.String(255), default=datetime.datetime.now().strftime("%Y-%m-%d"))


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'group_id': self.group_id,
            'message': self.message,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
