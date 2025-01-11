import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { thunkDeleteProfile } from "../../redux/session";
import { thunkLogout } from "../../redux/session";
import './DeleteProfileModal.css'
import { Link } from "react-router-dom";

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
          <div className="login-form-modal" id="remove-rsvp-modal">
          <div>
					<h1>Delete Profile</h1>
          </div>
          <p>Are you sure you want to make this change?</p>
          <p className="error">This action cannot be undone.</p>
          <button type="Submit" className='confirm-delete' onClick={handleSubmit}>Delete</button>
          <button 
          onClick={closeModal} 
          id='reverse'
          aria-label='no-go-back' 
          >
          No (Go Back)
          </button>

          </div>
        </>
      );

};

export default DeleteProfileModal;