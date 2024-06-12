import "./ProfilePage.css";
import { useState, useContext } from "react";
import authService from "../../services/auth.service";
import { AuthContext } from "../../context/auth.context";
import "./ProfilePage.css";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="profile-info">
        <div className="profile-item">
          <strong>Name:</strong> {user.name}
          <button>Edit</button>
        </div>
        <div className="profile-item">
          <strong>Last Name:</strong> {user.lastName}
          <button>Edit</button>
        </div>
        <div className="profile-item">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="profile-item">
          <strong>Address:</strong> <button>View</button>
        </div>
        <div className="profile-item">
          <strong>Payment Method:</strong> <button>View</button>
        </div>
        <div className="profile-item">
          <strong>Active Subscription:</strong> <button>View</button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
