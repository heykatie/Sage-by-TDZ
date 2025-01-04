import { NavLink } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useState } from 'react';
import { useSelector } from 'react-redux'; // Import to get the session user
import CreateGroupModal from '../GroupComponents/GroupModals/CreateGroupModal';

function Navigation() {
	const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

	// Get the logged-in user from Redux store
	const user = useSelector((state) => state.session.user);

	// Open modal
	const openGroupModal = () => {
		setShowCreateGroupModal(true);
	};

	// Close modal
	const closeGroupModal = () => {
		console.log('Closing modal'); // Debug log to ensure it's firing
		setShowCreateGroupModal(false);
	};

	return (
		<nav className='nav'>
			<ul>
				<li>
					<NavLink to='/'>Home</NavLink>
				</li>

				<li>
					<ProfileButton />
				</li>

				{/* Show "Create a Group" button only if user is logged in */}
				{user && (
					<li className='create-group-container'>
						<button
							className='create-group-button'
							onClick={openGroupModal}>
							Create a Group
						</button>
						{showCreateGroupModal && (
							<CreateGroupModal onClose={closeGroupModal} />
						)}
					</li>
				)}
			</ul>
		</nav>
	);
}

export default Navigation;
