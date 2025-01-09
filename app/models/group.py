from .db import db, environment, SCHEMA, add_prefix_for_prod

class Group(db.Model):
    __tablename__ = 'groups'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('events.id')), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    description = db.Column(db.Text, nullable=True)

    # Relationships
    event = db.relationship('Event', back_populates='groups', lazy=True)
    owner = db.relationship('User', back_populates='owned_groups', lazy=True)
    messages = db.relationship('Message', backref='group', cascade='all, delete-orphan', lazy=True)
    invites = db.relationship('Invites', backref='group', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'owner_id': self.owner_id,
            'description': self.description,
            'event': self.event.to_dict() if self.event else None,
            'owner': self.owner.to_dict() if self.owner else None,
        }