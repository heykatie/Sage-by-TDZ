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
  const ulRef = useRef(); // Ref to detect clicks outside the menu

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event from closing menu immediately
    setShowMenu((prev) => !prev);
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
    closeMenu(); // Close the menu after logout
    navigate('/');
  };

  return (
    <>
      <button onClick={toggleMenu} className="profile-menu-button">
        <FaUserCircle className="user-icon" />
        <IoMenu className="menu-icon" />
      </button>

      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <li className="user-info"><b>Hey {user.first_name}!</b></li>
              <li className="user-info">{user.username}</li>
              <li className="user-info">{user.email}</li>

              <li>
                <Link to="/profile/" onClick={closeMenu}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/friends/" onClick={closeMenu}>
                  Friends
                </Link>
              </li>
              <li>
                <Link to="/" onClick={closeMenu}>
                  Events
                </Link>
              </li>
              <li>
                <Link to="/groups/" onClick={closeMenu}>
                  Manage Groups
                </Link>
              </li>
              <li>
                <Link to="/notifications/" onClick={closeMenu}>
                  Notifications
                </Link>
              </li>
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