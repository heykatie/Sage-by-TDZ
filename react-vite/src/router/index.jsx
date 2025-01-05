import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
// import EventsIndex from '../components/EventsIndex';
import ListEvents from '../components/ListEvents';
import EventDetails from '../components/EventDetails';
import EditProfileModal from '../components/EditProfileModal';
import UpcomingEvents from '../components/UpcomingEvents';
import AllFriends from '../components/AllFriends';
import EventRSVPs from '../components/EventRSVPs';
import SingleFriend from '../components/SingleFriend';
import SharedEvents from '../components/SharedEvents';
import Profile from '../components/Profile';
import Layout from './Layout';
import GroupForm from '../components/GroupComponents/GroupForm';
import Group from '../components/GroupComponents/Group';

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <ListEvents />,
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
				path: 'friends/:friendId/events',
				element: <SharedEvents />,
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
			}
		],
	},
]);