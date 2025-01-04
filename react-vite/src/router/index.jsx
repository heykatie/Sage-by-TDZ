import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import EventsIndex from '../components/EventsIndex';
import EventDetails from '../components/EventDetails';
import EditProfileModal from '../components/EditProfileModal';
import UpcomingEvents from '../components/UpcomingEvents';
import AllFriends from '../components/AllFriends';
import EventRSVPs from '../components/EventRSVPs';
import SingleFriend from '../components/SingleFriend';
import SharedEvents from '../components/SharedEvents';
import ProfilePage from '../components/ProfilePage';
import Layout from './Layout';
import GroupFormPage from '../components/GroupComponents/GroupFormPage';

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <h1>Welcome!</h1>,
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
				path: 'events',
				element: <EventsIndex />,
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
				element: <ProfilePage />,
			},
			{
				path: 'groups/new',
				element: <GroupFormPage />,
			},
		],
	},
]);