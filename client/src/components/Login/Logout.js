import React from "react";
import "./Login.css";
import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
  const { logout } = useAuth0();

  return (
    <button
      className="btn btn-primary google-login-btn"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </button>
  );
};

export default Logout;
