import React from "react";
import "./Forms.css";

const PersonalForm = ({
  formData,
  handleInputChange,
  handlePersonalDetailsSubmit,
  handleGoBack,
  userPersonalDetails,
  setShowModal,
}) => (
  <form onSubmit={handlePersonalDetailsSubmit}>
    <div className="profile-item">
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Last Name:</label>
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
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

export default PersonalForm;
