import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { Link, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
    navigate('/');
  };


  return (
    <>
      <button
      onClick={toggleMenu}
      className="profile-menu-button"
      >
        <FaUserCircle className="user-icon" />
        <IoMenu className="menu-icon" />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
<<<<<<< Updated upstream
              <li id="user-info"><b>Hey {user.first_name}!</b></li>
              <li id="user-info">{user.username}</li>
              <li id="item">{user.email}</li>
              <li id="item"><Link 
              to='/profile/'
              onClick={closeMenu}
              >Dashboard</Link></li>
              <li id="item"><Link 
=======
              <li><b>Hey {user.first_name}!</b></li>
              <li>{user.username}</li>
              <li>{user.email}</li>
              <li><Link
              to='/profile/'
              onClick={closeMenu}
              >Dashboard</Link></li>
              <li><Link
>>>>>>> Stashed changes
              to='/friends/'
              onClick={closeMenu}
              >Friends</Link></li>
              <li id="item"><Link
              to='/'
              onClick={closeMenu}
              >Events</Link></li>
              <li id="item">
                <Link
                to='/groups/'
                >Manage Groups</Link></li>
              <li><Link to='notifications'>Notifications</Link></li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
