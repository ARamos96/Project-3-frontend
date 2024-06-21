import React from "react";
import "./Forms.css";

const PaymentMethodForm = ({
  formData,
  handleInputChange,
  handlePaymentMethodSubmit,
  handleGoBack,
  userPaymentMethod,
}) => (
  <form onSubmit={handlePaymentMethodSubmit}>
    <div className="profile-item">
      <label>Method:</label>
      <input
        type="text"
        name="method"
        value={formData.method}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Number:</label>
      <input
        type="text"
        name="number"
        value={formData.number}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>Expiration:</label>
      <input
        type="text"
        name="expiration"
        value={formData.expiration}
        onChange={handleInputChange}
      />
    </div>
    <div className="profile-item">
      <label>CVV:</label>
      <input
        type="text"
        name="CVV"
        value={formData.CVV}
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

export default PaymentMethodForm;
