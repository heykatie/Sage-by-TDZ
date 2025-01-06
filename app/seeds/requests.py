from app.models import db, Request, environment, SCHEMA
from sqlalchemy.sql import text

# Adds some demo groups, you can add more groups here if you want
def seed_requests():
    request1 = Request(
        sender_id=1,
        receiver_id=2,
        accepted=True
    )
    request2 = Request(
        sender_id=2,
        receiver_id=3,
        accepted=False
    )
    request3 = Request(
        sender_id=3,
        receiver_id=1,
        accepted=True
    )
    request4 = Request(
        sender_id=4,
        receiver_id=5,
        accepted=True
    )
    request5 = Request(
        sender_id=5,
        receiver_id=6,
        accepted=True
    )
    request6 = Request(
        sender_id=6,
        receiver_id=4,
        accepted=False
    )
    request7 = Request(
        sender_id=6,
        receiver_id=1,
        accepted=True
    )
    request8 = Request(
        sender_id=2,
        receiver_id=4,
        accepted=True
    )
    request9 = Request(
        sender_id=5,
        receiver_id=3,
        accepted=False
    )
    request10 = Request(
        sender_id=2,
        receiver_id=1
    )
    request11 = Request(
        sender_id=4,
        receiver_id=1
    )
    request12 = Request(
        sender_id=1,
        receiver_id=3
    )


    db.session.add(request1)
    db.session.add(request2)
    db.session.add(request3)
    db.session.add(request4)
    db.session.add(request5)
    db.session.add(request6)
    db.session.add(request7)
    db.session.add(request8)
    db.session.add(request9)
    db.session.add(request10)
    db.session.add(request11)
    db.session.add(request12)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the groups table.
# With postgres in production, TRUNCATE removes all the data from the table,
# RESET IDENTITY resets the auto-incrementing primary key, and CASCADE deletes
# any dependent entities. With sqlite3 in development, you must use DELETE
# to remove all data, which also resets primary keys.
def undo_requests():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.requests RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM requests"))

    db.session.commit()