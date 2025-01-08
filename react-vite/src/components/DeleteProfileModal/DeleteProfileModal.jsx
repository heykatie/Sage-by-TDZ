import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { thunkDeleteProfile } from "../../redux/session";
import './DeleteProfileModal.css'
import { Link } from "react-router-dom";
const sproutImage = 'https://i.postimg.cc/jdK73WSg/sprout.png'; // Sprout image

const DeleteProfileModal = () => {
    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector(state => state.session.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

        return dispatch(thunkDeleteProfile(user))
              .then(dispatch(thunkLogout()))
              .then(closeModal)
              .then(navigate('/'))
              .then(window.location.reload())
    }
    return (
        <>
          <div className="delete-modal">
          <div className="delete-modal-content">
          <div className="delete-modal-header">
          <img
						src={sproutImage}
						alt='Sprout'
						className='sprout-icon-left'
					/>
					<h1>Delete Profile</h1>
					<img
						src={sproutImage}
						alt='Sprout'
						className='sprout-icon-right'
					/>
          </div>
          <p>Are you sure you want to make this change?</p>
          <p>This action cannot be undone.</p>

          <button type="Submit" className='confirm-delete' onClick={handleSubmit}>Delete</button>
          <button className="cancel-delete"><Link to={'/profile'} onClick={closeModal}>No, Go Back.</Link></button>

          </div>
          </div>
        </>
      );

};

export default DeleteProfileModal;