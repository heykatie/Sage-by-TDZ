from .db import db, environment, SCHEMA, add_prefix_for_prod


class RSVP(db.Model):
    __tablename__ = 'rsvps'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('events.id')), nullable=False)

    # Relationships
    event = db.relationship('Event', back_populates='rsvps', lazy=True)
    user = db.relationship('User', back_populates='rsvps', lazy=True)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id,
        }
