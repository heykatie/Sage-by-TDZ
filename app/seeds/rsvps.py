from app.models import db, environment, SCHEMA
from app.models.rsvp import RSVP
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_rsvps():
    RSVPOne = RSVP(
        user_id=2,
        event_id=1,
        )
    RSVPTwo = RSVP(
        user_id=1,
        event_id=3,
        )
    RSVPThree = RSVP(
        user_id=3,
        event_id=1,
        )
    RSVPFour = RSVP(
        user_id=1,
        event_id=1,
        )
    RSVPFive = RSVP(
        user_id=1,
        event_id=2,
        )
    RSVPSix = RSVP(
        user_id=2,
        event_id=2,
        )
    RSVPSeven = RSVP(
        user_id=3,
        event_id=2,
        )
    RSVPEight = RSVP(
        user_id=4,
        event_id=2,
        )
    RSVPNine = RSVP(
        user_id=2,
        event_id=4,
        )
    RSVPTen = RSVP(
        user_id=3,
        event_id=5,
        )
    RSVPEleven = RSVP(
        user_id=4,
        event_id=6,
        )
    RSVPTwelve = RSVP(
        user_id=1,
        event_id=7,
        )
    RSVPThirteen = RSVP(
        user_id=2,
        event_id=8,
        )
    RSVPFourteen = RSVP(
        user_id=3,
        event_id=9,
        )
    RSVPFifteen = RSVP(
        user_id=6,
        event_id=10,
        )
    RSVPSixteen = RSVP(
        user_id=1,
        event_id=8,
        )
    RSVPSeventeen = RSVP(
        user_id=1,
        event_id=9,
        )
    RSVPEighteen = RSVP(
        user_id=1,
        event_id=11,
        )


    db.session.add(RSVPOne)
    db.session.add(RSVPTwo)
    db.session.add(RSVPThree)
    db.session.add(RSVPFour)
    db.session.add(RSVPFive)
    db.session.add(RSVPSix)
    db.session.add(RSVPSeven)
    db.session.add(RSVPEight)
    db.session.add(RSVPNine)
    db.session.add(RSVPTen)
    db.session.add(RSVPEleven)
    db.session.add(RSVPTwelve)
    db.session.add(RSVPThirteen)
    db.session.add(RSVPFourteen)
    db.session.add(RSVPFifteen)
    db.session.add(RSVPSixteen)
    db.session.add(RSVPSeventeen)
    db.session.add(RSVPEighteen)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_rsvps():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.rsvps RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM rsvps"))

    db.session.commit()