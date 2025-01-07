import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteProfile } from "../../redux/session";
import './DeleteProfileModal.css'

const DeleteProfileModal = ({ user }) => {
    const { closeModal } = useModal();

    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        dispatch(thunkDeleteProfile(user))
        closeModal()
        // .catch(async (res) => {
        // const data = await res.json();
        // });
    }
    return (
        <>
        <div className="delete-window">
        <h1>Confirm Delete</h1>
            <h3>Are you sure you want to remove this review?</h3>
            <button type="Submit" className="button-yes" onClick={handleSubmit}>Yes (Delete Profile)</button>
            <button type="Submit" className="button-no" onClick={closeModal}>No (Keep Profile)</button>
        </div>
        </>
    )

};

export default DeleteProfileModal;