from app.models import db, environment, SCHEMA
from app.models.event import Event
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_events():
    beachCleanUp = Event(
        title='Beach Clean Up',
        description="Join us for a community beach cleanup! Volunteer to help remove litter and protect our coastline. Whether you're a seasoned eco-warrior or a first-timer, all are welcome to make a positive impact on the environment. Let's work together to keep our beaches clean and safe for wildlife and future generations. All supplies provided—just bring your enthusiasm!",
        organizer_id=1,
        categories="Outdoors, Climate Change",
        address='3456 University Dr.',
        city='Houston',
        state='Texas',
        event_date='2025-04-10',
        start_time='8:00:00',
        end_time='14:00:00',
        badge_url='badgeOneURL',
        preview='https://i0.wp.com/www.onegreenplanet.org/wp-content/uploads/2017/07/img_4149.jpg'
        )
    xmasToyDrive = Event(
        title='Holiday Toy Drive',
        description="Spread holiday cheer by volunteering at our Christmas Toy Drive! Help collect, sort, and distribute toys to children in need this season. Your time and kindness will make a world of difference, ensuring every child receives a gift to brighten their holiday. All ages welcome—come share the spirit of giving!",
        organizer_id=1,
        categories='Indoors, Donation, Handicap Accessible',
        address='6708 Mountainview Cirle',
        city='Salt Lake City',
        state='Utah',
        event_date='2024-12-19',
        start_time='10:30:00',
        end_time='16:30:00',
        badge_url='badgeTwoURL',
        preview='https://www.clinton.k12.ma.us/ourpages/auto/2023/11/30/46834948/toydrive.jpg'
        )
    soupKitchen = Event(
        title='Soup Kitchen',
        description="Join us at the local soup kitchen to serve warm meals and spread kindness to those in need. Volunteers will help prepare, serve, and pack meals for individuals and families in the community. It’s a great way to make a direct impact and share a moment of compassion during the holiday season and beyond. All are welcome to help!",
        organizer_id=3,
        categories='Indoors, Handicap Accessible',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2025-03-06',
        start_time='7:00:00',
        end_time='20:15:00',
        badge_url='badgeThreeURL',
        preview='https://static.wixstatic.com/media/406c48_1778d6d9e5924cd9a23d9d1b6182debb~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_auto/406c48_1778d6d9e5924cd9a23d9d1b6182debb~mv2.jpg'
        )
    puppyCarWash = Event(
        title='Puppy Car Wash',
        description="Get ready for a fun-filled day at our Puppy Car Wash! Volunteer to help wash cars while our adorable pups bring smiles and joy to everyone. All proceeds go toward supporting local animal shelters. It's a paws-itively great way to give back to the community, have fun, and help animals in need. Bring your enthusiasm and love for furry friends!",
        organizer_id=2,
        categories='Outdoors, Handicap Accessible, Animal Adoption',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2024-01-26',
        start_time='10:00:00',
        end_time='12:30:00',
        badge_url='badgeFourURL',
        preview='https://myhswm.org/wp-content/uploads/2023/06/DSC00289-1-1024x576.jpg'
        )
    helpingHands = Event(
        title='Helping Hands',
        description="Join us for a hands-on home building volunteer event! Help construct safe, stable homes for families in need by working alongside others in your community. Whether you're experienced or a first-timer, you'll play a key role in making a lasting impact. All skill levels are welcome—come build more than just walls, but a brighter future for those in need.",
        organizer_id=1,
        categories='Outdoors, Community Development, Physical',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2025-05-23',
        start_time='8:00:00',
        end_time='17:00:00',
        badge_url='badgeFiveURL',
        preview='https://bridgebible.church/wp-content/uploads/2023/03/Helping-Hand-logo-940x720.png'
        )
    kidsTheatre = Event(
        title='Kids Theatre',
        description="Help bring a kids' theatre production to life by volunteering as a Stage Manager at the local community center! As a Stage Manager, you'll oversee backstage operations, coordinate props, and ensure everything runs smoothly during performances. It's a fun and rewarding opportunity to work with young actors and create a memorable experience for the community. No experience necessary—just a passion for theater and a love of working with kids!",
        organizer_id=3,
        categories='Indoors, Handicap Accessible',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2025-10-06',
        start_time='17:30:00',
        end_time='20:00:00',
        badge_url='badgeSixURL',
        preview='https://images.childrenstheatre.org/uploads/2019/10/KER_6617.jpg'
        )
    communityGarden = Event(
        title='Community Garden',
        description="Come dig in and help grow our community garden! Volunteer to plant, weed, water, and maintain the garden, contributing to a greener, more sustainable neighborhood. It's a great opportunity to connect with others, learn about gardening, and help provide fresh produce to local families. All skill levels welcome—let's cultivate a thriving space together!",
        organizer_id=3,
        categories='Outdoors, Handicap Accessible, Community Development',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2025-01-06',
        start_time='7:00:00',
        end_time='20:15:00',
        badge_url='badgeSevenURL',
        preview='https://cdn.hosted-assets.com/nourishingneighbors/ul/q_auto/9DEY071R/c89e77/c89e77-iStock-1364679535.jpg'
        )
    bigBrotherBigSister = Event(
        title='Big Brother Big Sister',
        description="Are you a college student interested in child care? Volunteer as a mentor for younger kids and make a positive impact in their lives! As a mentor, you’ll guide, support, and inspire children while helping them develop new skills and confidence. This is a fantastic opportunity to gain hands-on experience in child development while making a real difference in your community.",
        organizer_id=3,
        categories='Indoors, Handicap Accessible, Virtual',
        address='None',
        city='None',
        state='None',
        event_date='2025-02-10',
        start_time='15:00:00',
        end_time='17:15:00',
        badge_url='badgeEightURL',
        preview='https://mentornj.org/wp-content/uploads/2024/05/about-intro.jpg'
        )
    readToTheElderly = Event(
        title='Read to the Elderly',
        description="Volunteer to read to the elderly and brighten their day with stories, poems, and more! This opportunity is especially valuable for those looking to earn community service hours while making a meaningful connection with older adults. It’s a wonderful way to bring joy, combat loneliness, and offer companionship, all while fulfilling your service goals.",
        organizer_id=1,
        categories='Indoors, Handicap Accessible',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2025-09-04',
        start_time='7:00:00',
        end_time='20:15:00',
        badge_url='badgeNineURL',
        preview='https://bpb-eu-w2.wpmucdn.com/blogs.bristol.ac.uk/dist/3/200/files/2019/02/shutterstock_1033321135-25sky2w.jpg'
        )
    holidayHotline = Event(
        title='Holiday Hotline',
        description="Make a difference this holiday season by volunteering virtually for a crisis prevention hotline. Support individuals experiencing feelings of loneliness or isolation by offering a listening ear, empathy, and resources. This flexible, remote opportunity allows you to provide comfort and hope to those in need during the holidays, all from the safety of your home. Perfect for those looking to give back while earning community service hours or making a lasting impact.",
        organizer_id=1,
        categories='Indoors, Crisis Relief',
        address='None',
        city='None',
        state='None',
        event_date='2024-12-25',
        start_time='6:00:00',
        end_time='23:55:00',
        badge_url='badgeTenURL',
        preview='https://www.sfsuicide.org/wp-content/uploads/2021/08/SFSP-Hotline-Volunteer.png'
        )
    disasterRelief = Event(
        title='Disaster Relief',
        description="Volunteer to help rebuild homes and businesses in the wake of a recent weather disaster. Your efforts will directly support communities in need, from clearing debris to repairing structures and restoring essential services. It’s a chance to make a meaningful, hands-on impact while helping families and local businesses recover and rebuild their lives. All skill levels welcome—your time and compassion will make a real difference.",
        organizer_id=1,
        categories='Outdoors, Crisis Relief',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2025-11-09',
        start_time='15:00:00',
        end_time='18:00:00',
        badge_url='badgeElevenURL',
        preview='https://www.allhandsandhearts.org/wp-content/uploads/2023/06/400_Turkey_Response_DART_IMG0034_02.19.23.webp'
        )
    clothingDrive = Event(
        title='Clothing Drive',
        description="Join us in supporting women in need by volunteering to gather clothes and feminine hygiene products. Help collect, sort, and distribute essential items to ensure women have the resources they need to feel comfortable and dignified. It’s a meaningful opportunity to make a direct impact and provide much-needed support to women in your community.",
        organizer_id=3,
        categories='Indoors, Handicap Accessible, Donation',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2024-03-11',
        start_time='7:00:00',
        end_time='20:15:00',
        badge_url='badgeTwelveURL',
        preview='https://svdpli.org/wp-content/uploads/2023/10/iStock-1362787530-1_11zon-1024x683.jpg'
        )
    catDates = Event(
        title='Cat Dates',
        description="Join us for Cat Dates, a fun volunteer opportunity where you can spend time with adorable cats at a local shelter! Help socialize, play with, and care for the cats while assisting potential adopters in finding their perfect feline match. Whether you're looking to adopt or simply love spending time with cats, your support helps these animals find their forever homes. It’s a purrfect way to give back and make a difference!",
        organizer_id=2,
        categories='Indoors, Handicap Accessible, Animal Adoption',
        address='2367 Apple St. Apt 4B',
        city='New York',
        state='New York',
        event_date='2025-05-14',
        start_time='10:00:00',
        end_time='17:00:00',
        badge_url='badgeThirteenURL',
        preview='https://heavenlypets.org/wp-content/uploads/2021/04/Perrys-Place-DeRemer-Final_-8-scaled-e1709358056657-1536x1197.jpg'
        )

    db.session.add(beachCleanUp)
    db.session.add(xmasToyDrive)
    db.session.add(soupKitchen)
    db.session.add(puppyCarWash)
    db.session.add(helpingHands)
    db.session.add(kidsTheatre)
    db.session.add(communityGarden)
    db.session.add(bigBrotherBigSister)
    db.session.add(readToTheElderly)
    db.session.add(holidayHotline)
    db.session.add(disasterRelief)
    db.session.add(clothingDrive)
    db.session.add(catDates)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_events():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.events RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM events"))

    db.session.commit()
