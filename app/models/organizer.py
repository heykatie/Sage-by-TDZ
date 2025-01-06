from .db import db, environment, SCHEMA


class Organizer(db.Model):
    __tablename__ = 'organizers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, unique=True)
    description = db.Column(db.String(2000), nullable=False)
    logo = db.Column(db.String(1000), nullable=False)
    link = db.Column(db.String(1000), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(1000), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'logo': self.logo,
            'link': self.link,
            'phone_number': self.phone_number,
            'email': self.email,
        }
