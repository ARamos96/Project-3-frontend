import React from "react";
import "./Forms.css";
import ProfilePageFormFunctions from "../../utils/ProfilePageFormFunctions";

const { getChangedFields, closeRelevantForm } = ProfilePageFormFunctions();

const AddressForm = ({
  formData,
  handleInputChange,
  handleAddressSubmit,
  handleGoBack,
  userAddress,
  setShowModal,
}) => (
  <form onSubmit={handleAddressSubmit}>
    <div className="profile-item">
      <label>Address:</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>City:</label>
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Region:</label>
      <input
        type="text"
        name="region"
        value={formData.region}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Zip Code:</label>
      <input
        type="text"
        name="zipCode"
        value={formData.zipCode}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Country:</label>
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Phone:</label>
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
      />
    </div>
    <div className="button-group">
      <button className="button-profile" type="submit">
        Save
      </button>
      <button
        className="button-profile"
        type="button"
        onClick={() =>
          handleGoBack(
            userAddress,
            "address",
            getChangedFields,
            setShowModal,
            closeRelevantForm
          )
        }
      >
        Go Back Without Saving
      </button>
    </div>
  </form>
);

export default AddressForm;
