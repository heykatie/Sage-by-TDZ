// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
// import { useState } from "react";
import { thunkEditProfile, thunkLogin } from "../../redux/session";
import './EditProfileModal.css'
import { Link } from "react-router-dom";
const sproutImage = 'https://i.postimg.cc/jdK73WSg/sprout.png'; // Sprout image

const EditProfileModal = ({ payload }) => {
    const { closeModal } = useModal();
    // const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

        return dispatch(thunkEditProfile(payload))
               .then(closeModal)
            // .catch(async (res) => {
            // const data = await res.json();
            // if(data.errors) return data.errors;
            // })


            // const serverResponse = await dispatch(
            //     thunkLogin(credentials)
            //   );

            // if (serverResponse) setErrors(serverResponse);



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
					<h1>Edit Profile</h1>
					<img
						src={sproutImage}
						alt='Sprout'
						className='sprout-icon-right'
					/>
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