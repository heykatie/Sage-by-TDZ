import { useState } from "react"
import { useSelector } from "react-redux"
// import { AllFriends } from './AllFriends'
// import { EventRSVPs } from './EventRSVPs'
// import { GroupComponent } from './GroupComponent'

const Badges = () => <div>
    <h2>badges</h2>
    </div>

const Friends = () => <div>
    <h2>Friends</h2>
    {/* <AllFriends /> */}
    </div>

const Events = () => <div>
    <h2>Events</h2>
    {/* <EventRSVPs /> */}
    </div>

const Groups = () => <div>
    <h2>Groups</h2>
    {/* <GroupComponent /> */}
    </div>


function Dashboard() {

    const user = useSelector(state => state.session.user)
    console.log(user)
    const [activeComponent, setActiveComponent] = useState('badges')

    const renderComponent = () => {
        switch (activeComponent) {
            case 'badges':
                return <Badges />
            case 'friends':
                return <Friends />
            case 'events':
                return <Events />
            case 'groups':
                return <Groups />
            default:
                return <Badges />
        }
    }

    return (
        <>
            <div className="dashboard-title">
                <h3>{user.username} DASHBOARD</h3>
                <div className="content-links">
                    <button onClick={() => setActiveComponent('badges')}>Badges</button>
                    <button onClick={() => setActiveComponent('friends')}>Friends</button>
                    <button onClick={() => setActiveComponent('events')}>Events</button>
                    <button onClick={() => setActiveComponent('groups')}>Groups</button>
                </div>
            </div>
            <div className="dashboard-content">
                {renderComponent()}
            </div>
        </>

    )
}

export default Dashboard