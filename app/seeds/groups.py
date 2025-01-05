from app.models import db, Group, environment, SCHEMA
from sqlalchemy.sql import text

# Adds some demo groups, you can add more groups here if you want
def seed_groups():
    group1 = Group(
        event_id=1,
        owner_id=1,
        description="Let's save the turtles!"
    )
    group2 = Group(
        event_id=2,
        owner_id=4,
        description="Bring your holiday cheer!"
    )
    group3 = Group(
        event_id=3,
        owner_id=1,
        description="We'll be serving soup and other foods to our community."
    )
    group4 = Group(
        event_id=4,
        owner_id=2,
        description="Our donation goal is $5000."
    )
    group5 = Group(
        event_id=5,
        owner_id=3,
        description="We're helping our local community center with their new auditorium."
    )
    group6 = Group(
        event_id=6,
        owner_id=4,
        description="Upcoming play is Shakespeare's Hamlet."
    )
    group7 = Group(
        event_id=7,
        owner_id=1,
        description="Let's help our city brighten their sidewalks."
    )
    group8 = Group(
        event_id=8,
        owner_id=2,
        description="Our mission to bring our society members together including the elderly."
    )
    group9 = Group(
        event_id=9,
        owner_id=3,
        description="Our mission to bring our society members together including the elderly."
    )
    group10 = Group(
        event_id=10,
        owner_id=6,
        description="Blood donations."
    )

    db.session.add_all([
        group1, group2, group3, group4, group5,
        group6, group7, group8, group9, group10
    ])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the groups table.
# With postgres in production, TRUNCATE removes all the data from the table,
# RESET IDENTITY resets the auto-incrementing primary key, and CASCADE deletes
# any dependent entities. With sqlite3 in development, you must use DELETE
# to remove all data, which also resets primary keys.
def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))

    db.session.commit()