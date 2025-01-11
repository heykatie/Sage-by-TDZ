// import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import { useState } from "react";
import { thunkEditProfile } from "../../redux/session";
import './EditProfileModal.css'

const EditProfileModal = ({ payload }) => {
    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        return dispatch(thunkEditProfile(payload))
               .then(closeModal)

    }

    return (
        <>
          <div className="login-form-modal" id="remove-rsvp-modal">
       
          <div >
					<h1>Edit Profile</h1>
          </div>
          <p>Are you sure you want to make this change?</p>
          <button type="Submit" className='confirm-delete' onClick={handleSubmit}>Save Edit</button>
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

export default EditProfileModal;