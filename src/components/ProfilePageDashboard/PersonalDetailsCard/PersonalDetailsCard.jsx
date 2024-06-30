import React from "react";
import PersonalForm from "../../Forms/PersonalForm";
import AddressForm from "../../Forms/AddressForm";
import PaymentMethodForm from "../../Forms/PaymentMethodForm";
import PasswordForm from "../../Forms/PasswordForm";

const PersonalDetailsCard = ({ personalDetailsCardProps }) => {
  const {
    user,
    personalDetails,
    setPersonalDetails,
    handleInputChange,
    handlePersonalDetailsSubmit,
    handleGoBack,
    userPersonalDetails,
    handleEditFormClick,
    alertIfOtherFormsOpen,
    isEditingForms,
    setIsEditingForms,
    setConfirmAction,
    addressDetails,
    setAddressDetails,
    handleAddressSubmit,
    userAddress,
    paymentMethodDetails,
    setPaymentMethodDetails,
    handlePaymentMethodSubmit,
    userPaymentMethod,
    passwordDetails,
    setPasswordDetails,
    handlePasswordSubmit,
    isDataEmptyStrings,
    setShowModal,
    handleGoBackAction,
    getChangedFields,
    handleUserUpdate,
    userPassword,
  } = personalDetailsCardProps;

  const {
    setIsEditingPersonalDetails,
    setIsEditingAddress,
    setIsEditingPaymentMethod,
    setIsChangingPassword,
  } = setIsEditingForms;

  const {
    isEditingPersonalDetails,
    isEditingAddress,
    isEditingPaymentMethod,
    isChangingPassword,
  } = isEditingForms;

  return (
    <div style={{ flex: "1 1 0%", minWidth: 300, padding: 10 }}>
      <h2>Personal Details</h2>
      {isEditingPersonalDetails ? (
        <PersonalForm
          formData={personalDetails}
          handleInputChange={(e) =>
            handleInputChange(e, setPersonalDetails, personalDetails)
          }
          handlePersonalDetailsSubmit={(e) =>
            handlePersonalDetailsSubmit(
              e,
              getChangedFields,
              userPersonalDetails,
              handleUserUpdate,
              setIsEditingPersonalDetails,
              personalDetails
            )
          }
          handleGoBack={() =>
            handleGoBack(
              personalDetails,
              "personalDetails",
              getChangedFields,
              setShowModal,
              handleGoBackAction,
              userPersonalDetails
            )
          }
          userPersonalDetails={userPersonalDetails}
        />
      ) : (
        <>
          <div className="profile-item">
            <strong>Name:</strong> {user.name}
          </div>
          <div className="profile-item">
            <strong>Last Name:</strong> {user.lastName}
          </div>
          <div className="profile-item">
            <strong>Email:</strong> {user.email}
          </div>
          {user.address && (
            <div className="profile-item">
              <strong>Address:</strong> {user.address.address},{" "}
              {user.address.city}, {user.address.region}, {user.address.zipCode}
              , {user.address.country}, {user.address.phone}
            </div>
          )}
          <button
            className="button-profile"
            onClick={() =>
              handleEditFormClick(
                alertIfOtherFormsOpen,
                isEditingForms,
                setIsEditingPersonalDetails,
                setConfirmAction,
                setPersonalDetails,
                user,
                "personalDetails"
              )
            }
          >
            Edit Personal Details
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </>
      )}
      {isEditingAddress ? (
        <AddressForm
          formData={addressDetails}
          handleInputChange={(e) =>
            handleInputChange(e, setAddressDetails, addressDetails)
          }
          handleAddressSubmit={(e) =>
            handleAddressSubmit(
              e,
              getChangedFields,
              userAddress,
              handleUserUpdate,
              setIsEditingAddress,
              addressDetails
            )
          }
          handleGoBack={() =>
            handleGoBack(
              addressDetails,
              "address",
              getChangedFields,
              setShowModal,
              handleGoBackAction,
              userAddress
            )
          }
          userAddress={userAddress}
        />
      ) : (
        <button
          className="button-profile"
          onClick={() =>
            handleEditFormClick(
              alertIfOtherFormsOpen,
              isEditingForms,
              setIsEditingAddress,
              setConfirmAction,
              setAddressDetails,
              user,
              "address"
            )
          }
        >
          {isDataEmptyStrings(userAddress)
            ? "Add Address Details"
            : "Edit Address Details"}{" "}
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      {isEditingPaymentMethod ? (
        <PaymentMethodForm
          formData={paymentMethodDetails}
          handleInputChange={(e) =>
            handleInputChange(e, setPaymentMethodDetails, paymentMethodDetails)
          }
          handlePaymentMethodSubmit={(e) =>
            handlePaymentMethodSubmit(
              e,
              getChangedFields,
              userPaymentMethod,
              handleUserUpdate,
              setIsEditingPaymentMethod,
              paymentMethodDetails
            )
          }
          handleGoBack={() =>
            handleGoBack(
              paymentMethodDetails,
              "paymentMethod",
              getChangedFields,
              setShowModal,
              handleGoBackAction,
              userPaymentMethod
            )
          }
          userPaymentMethod={userPaymentMethod}
        />
      ) : (
        <button
          className="button-profile"
          onClick={() =>
            handleEditFormClick(
              alertIfOtherFormsOpen,
              isEditingForms,
              setIsEditingPaymentMethod,
              setConfirmAction,
              setPaymentMethodDetails,
              user,
              "paymentMethod"
            )
          }
        >
          {isDataEmptyStrings(userPaymentMethod)
            ? "Add Payment Method"
            : "Edit Payment Method"}{" "}
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}
      {isChangingPassword ? (
        <PasswordForm
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
        />
      ) : (
        <button
          className="button-profile"
          onClick={() =>
            handleEditFormClick(
              alertIfOtherFormsOpen,
              isEditingForms,
              setIsChangingPassword,
              setConfirmAction,
              setPasswordDetails,
              user,
              "password"
            )
          }
        >
          Change Password
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}
    </div>
  );
};
export default PersonalDetailsCard;
