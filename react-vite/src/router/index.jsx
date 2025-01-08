import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import ListEvents from '../components/ListEvents';
import EventDetails from '../components/EventDetails';
import EditProfileModal from '../components/EditProfileModal';
import UpcomingEvents from '../components/UpcomingEvents';
import EventRSVPs from '../components/EventRSVPs';
import SingleFriend from '../components/SingleFriend';
import Profile from '../components/Profile';
import GroupInvites from '../components/InvitePage/InvitePage';
import Layout from './Layout';
import GroupForm from '../components/GroupComponents/GroupForm';
import Group from '../components/GroupComponents/Group';
import Dashboard from '../components/Dashboard/Dashboard';
import FriendsPage from '../components/FriendsPage/FriendsPage';
import RequestsPage from '../components/Notif/Requests/Requests';
import AllGroups from '../components/AllGroups/AllGroups';
import Notification from '../components/Notif/Notifications';

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
				element: <FriendsPage />,
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
				path: '/requests',
				element: <RequestsPage />,
			},
			{
				path: 'groups/new',
				element: <GroupForm isEditMode={false} />,
			},
			{
				path: 'groups/:groupId',
				element: <Group />,
			},
			{
				path: 'groups/:groupId/edit',
				element: <GroupForm isEditMode={true} />,
			},
			{
				path: 'dashboard',
				element: <Dashboard />,
			},
			{
				path: 'notifications',
				element: <Notification />
			},
			{
				path: 'invites/:userId',
				element: <GroupInvites />,
			},
			{
				path: 'groups',
				element: <AllGroups />,
			},
			{
				path: '*',
				element: <Navigate to='/' replace={true} />
			}
		],
	},
]);