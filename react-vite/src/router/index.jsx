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
// import ListEvents from '../components/ListEvents';
import GroupInvites from '../components/InvitePage/InvitePage';
import Layout from './Layout';
import GroupComponent from '../components/GroupComponent';
import Dashboard from '../components/Dashboard/Dashboard';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: "events",
        element: <EventsIndex />,
      },
      {
        path: "events/:eventId",
        element: <EventDetails />,
      },
      {
        path: "profile/edit",
        element: <EditProfileModal />,
      },
      {
        path: "profile/rsvps",
        element: <UpcomingEvents />,
      },
      {
        path: "friends",
        element: <AllFriends />
      },
      {
        path: "friends/:friendId",
        element: <SingleFriend />
      },
      {
        path: "friends/:friendId/events",
        element: <SharedEvents />
      },
      {
        path: "events/:eventId/rsvps",
        element: <EventRSVPs />
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "groups/new",
        element: <GroupComponent />,
      },
      {
        path: "invites/:userId",
        element: <GroupInvites />
      },
    ],
  },
]);