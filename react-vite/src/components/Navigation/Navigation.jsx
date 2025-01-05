import { useState } from 'react';
import CreateGroupModal from '../CreateGroupModal';
import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";


function Navigation() {
	const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

	// Open modal
	const openModal = () => {
		setShowCreateGroupModal(true);
	};

	// Close modal
	const closeModal = () => {
		console.log('Closing modal'); // Debug log to ensure it's firing
		setShowCreateGroupModal(false);
	};

	return (
		<nav className='nav'>
			<ul>
				<div className="logo-container">
					<li>
						<NavLink to="/">
						<img src="react-vite/public/favicon.ico" alt="Sage-Mascot" />
						</NavLink>
					</li>
				</div>
				<div className="site-name">
					<li>
						SAGE
					</li>
				</div>
				{/* Create Group Modal */}
				<li className='create-group-container'>
					<button className='create-group-button' onClick={openModal}>
						Create Group
					</button>
					{showCreateGroupModal && (
						<CreateGroupModal onClose={closeModal} />
					)}
				</li>
				<div className="profile-button">
					<li>
						<ProfileButton />
					</li>
				</div>

			</ul>
		</nav>
	);
}

export default Navigation;
