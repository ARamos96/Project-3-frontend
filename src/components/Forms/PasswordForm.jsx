import React from "react";
import "./Forms.css";

/*<PasswordForm
        formData={passwordDetails}
        handleInputChange={(e) =>
          handleInputChange(e, setPasswordDetails, passwordDetails)
        }
        handlePasswordSubmit={(e) =>
          handlePasswordSubmit(
            e,
            getChangedFields,
            handleUserUpdate,
            setIsChangingPassword,
            passwordDetails
          )
        }
        handleGoBack={() =>
          handleGoBack(
            passwordDetails,
            "password",
            getChangedFields,
            setShowModal,
            handleGoBackAction,
            userPassword
          )
        }
      />*/

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
        Change Password
      </button>
      <button className="button-profile" type="button" onClick={handleGoBack}>
        Go Back Without Saving
      </button>
    </div>
  </form>
);

export default PasswordForm;
