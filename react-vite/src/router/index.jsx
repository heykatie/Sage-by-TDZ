import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
// import EventsIndex from '../components/EventsIndex';
// import ListEvents from '../components/ListEvents';
import EventDetails from '../components/EventDetails';
import EditProfileModal from '../components/EditProfileModal';
import UpcomingEvents from '../components/UpcomingEvents';
import AllFriends from '../components/AllFriends';
import EventRSVPs from '../components/EventRSVPs';
import SingleFriend from '../components/SingleFriend';
import Profile from '../components/Profile';
// import SharedEvents from '../components/SharedEvents';
// import ProfilePage from '../components/ProfilePage';
// import ListEvents from '../components/ListEvents';
import GroupInvites from '../components/InvitePage/InvitePage';
import Layout from './Layout';
import GroupForm from '../components/GroupComponents/GroupForm';
import Group from '../components/GroupComponents/Group';
// import GroupComponent from '../components/GroupComponent';
import Dashboard from '../components/Dashboard/Dashboard';

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <>Welcome</>,
			},
			{
				path: 'login',
				element: <LoginFormPage />,
			},
			{
				path: 'signup',
				element: <SignupFormPage />,
			},
			{
				path: 'events/:eventId',
				element: <EventDetails />,
			},
			{
				path: 'profile/edit',
				element: <EditProfileModal />,
			},
			{
				path: 'profile/rsvps',
				element: <UpcomingEvents />,
			},
			{
				path: 'friends',
				element: <AllFriends />,
			},
			{
				path: 'friends/:friendId',
				element: <SingleFriend />,
			},
			{
				path: 'events/:eventId/rsvps',
				element: <EventRSVPs />,
			},
			{
				path: 'profile',
				element: <Profile />,
			},
			{
				path: 'groups/new',
				element: <GroupForm />,
			},
			{
				path: 'groups/:groupId',
				element: <Group/>
			},
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: "invites/:userId",
        element: <GroupInvites />
      },
    ],
  },
]);