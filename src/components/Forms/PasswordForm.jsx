import React from "react";
import "./Forms.css";

const PasswordForm = ({
  formData,
  handleInputChange,
  handlePasswordSubmit,
  handleGoBack,
}) => (
  <form onSubmit={handlePasswordSubmit}>
    <div className="profile-item">
      <label>Current Password:</label>
      <input
        type="password"
        name="oldPassword"
        value={formData.oldPassword}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>New Password:</label>
      <input
        type="password"
        name="newPassword"
        value={formData.newPassword}
        onChange={handleInputChange}
      />
    </div>
    <div className="button-group">
      <button className="button-profile" type="submit">
        Save
      </button>
      <button className="button-profile" type="button" onClick={handleGoBack}>
       Go Back Without Saving
      </button>
    </div>
  </form>
);

export default PasswordForm;
