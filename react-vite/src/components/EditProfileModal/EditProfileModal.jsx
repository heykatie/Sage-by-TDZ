// import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import { useState } from "react";
import { thunkEditProfile } from "../../redux/session";
import './EditProfileModal.css'
import { Link } from "react-router-dom";

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
          <div className="delete-modal">
          <div className="delete-modal-content">
          <div className="delete-modal-header">
					<h1>Edit Profile</h1>
          </div>
          <p>Are you sure you want to make this change?</p>
          <button type="Submit" className='confirm-delete' onClick={handleSubmit}>Save Edit</button>
          <Link to={'/profile'} onClick={closeModal}>No, Go Back.</Link>

          </div>
          </div>
        </>
      );

};

export default EditProfileModal;