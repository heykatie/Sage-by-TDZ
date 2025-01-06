from app.models.invites import db, Invites, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_invites():
    invite1 = Invites(
        user_id=1, friend_id=2, group_id=1, event_id=1, going= True )
    invite2 = Invites(
        user_id=3, friend_id=1, group_id=2, event_id=2, going= None )
    invite3 = Invites(
        user_id=1, friend_id=3, group_id=3, event_id=3, going= True )
    invite4 = Invites(
        user_id=6, friend_id=4, group_id=4, event_id=4, going= None )
    invite5 = Invites(
        user_id=5, friend_id=2, group_id=5, event_id=5, going= None )
    invite6 = Invites(
        user_id=5, friend_id=3, group_id=6, event_id=6, going= None )

    db.session.add(invite1)
    db.session.add(invite2)
    db.session.add(invite3)
    db.session.add(invite4)
    db.session.add(invite5)
    db.session.add(invite6)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_invites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.invites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM invites"))

    db.session.commit()