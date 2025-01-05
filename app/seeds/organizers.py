from app.models import db, environment, SCHEMA
from app.models.organizer import Organizer
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_organizers():
    redCross = Organizer(
        name='Red Cross',
        description='Red Cross volunteers and staff work to deliver vital services – from providing relief and support to those in crisis, to helping you be prepared to respond in emergencies',
        logo='https://prnewswire2-a.akamaihd.net/p/1893751/sp/189375100/thumbnail/entry_id/0_tg3nh4xw/def_height/2700/def_width/2700/version/100012/type/1',
        link='https://www.redcross.org/',
        phone_number='786-306-5050',
        email='redcross@aa.io'
        )
    peta = Organizer(
        name='PETA',
        description='People for the Ethical Treatment of Animals (PETA) is the largest animal rights organization in the world, and PETA entities have more than 9 million members and supporters globally.',
        logo='https://www.peta.org/wp-content/themes/peta/src/assets/images/svgs/peta-logo.svg',
        link='https://www.peta.org/',
        phone_number='222-306-3467',
        email='peta@aa.io'
        )
    blm = Organizer(
        name='BLM',
        description='Black Lives Matter is working inside and outside of the system to heal the past, reimagine the present, and invest in the future of Black lives through policy change, investment in our communities, and a commitment to arts and culture.',
        logo='https://blacklivesmatter.com/wp-content/themes/blm24/assets/images/logo-frontpage.svg',
        link='https://blacklivesmatter.com/',
        phone_number='888-546-8907',
        email='blm@aa.io'
        )

    db.session.add(redCross)
    db.session.add(peta)
    db.session.add(blm)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_organizers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.organizers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM organizers"))

    db.session.commit()