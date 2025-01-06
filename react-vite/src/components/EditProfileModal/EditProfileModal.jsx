// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import { thunkEditProfile, thunkLogin } from "../../redux/session";
import './EditProfileModal.css'
import { Link } from "react-router-dom";
const sproutImage = 'https://i.postimg.cc/jdK73WSg/sprout.png'; // Sprout image

const EditProfileModal = ({ user, newData }) => {
    const { closeModal } = useModal();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    user = useSelector(state => state.session.user)

    console.log(errors)

    const handleSubmit = async (e) => {
        e.preventDefault();

        let credentials = {
            email: user.email,
            password
        }

        if (password === confirmPassword){
            const serverResponse = await dispatch(
                thunkLogin(credentials)
              );

            if (serverResponse) setErrors(serverResponse);

            return dispatch(thunkEditProfile(newData))
            .then(closeModal)
            .catch(async (res) => {
            const data = await res.json();
            if ( data ) {
            console.log(data)
            }
            })
        }

        setErrors({password: 'passwords must match'})
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
          <form onSubmit={handleSubmit}>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && <p>{errors.password}</p>}
            <button type="Submit" className='confirm-delete' onClick={handleSubmit}>Save Edit</button>
            <Link to={'/profile'} onClick={closeModal}>No, Go Back.</Link>
          </form>
          </div>
          </div>
        </>
      );

};

export default EditProfileModal;