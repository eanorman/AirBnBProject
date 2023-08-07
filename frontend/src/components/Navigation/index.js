import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../catbnb.png";
import NewSpot from "../NewSpot/NewSpot";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navbar">
      <li>
        <NavLink exact to="/">
          <img src={logo} alt="logo" />
        </NavLink>
      </li>
      {isLoaded && sessionUser ? (
        <>
        <li>
          <NewSpot />
        </li>
          <li>
            <ProfileButton user={sessionUser} />
          </li>
          </>
      ) : (
          <li>
            <ProfileButton user={sessionUser} />
          </li>

      )}
    </ul>
  );
}

export default Navigation;
