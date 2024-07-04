import React, { useContext } from "react";
import PersonalForm from "../../Forms/PersonalForm";
import AddressForm from "../../Forms/AddressForm";
import PaymentMethodForm from "../../Forms/PaymentMethodForm";
import PasswordForm from "../../Forms/PasswordForm";
import { AuthContext } from "../../../context/auth.context";
import Loading from "../../Loading/Loading";

const NewPersonalDetailsCard = ({ personalDetailsCardProps }) => {
  const { isUserLoaded } = useContext(AuthContext);
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

  if (!user && !isUserLoaded) {
    return <Loading />;
  }

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
          <div className="personal-details-container">
            <div className="profile-pic">
              <img
                src="https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg"
                alt="profile-avatar"
              />
            </div>
            <div>
              <div className="profile-item">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
              </div>
              <div className="profile-item">
                <p>
                  <strong>Last Name:</strong> {user.lastName}
                </p>
              </div>
              <div className="profile-item">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
              {user.address && (
                <div className="profile-item">
                  <p></p><strong>Address:</strong> {user.address.address},<br />
                  {user.address.zipCode}, {user.address.city},<br />
                  {user.address.region}, {user.address.country}
                </div>
              )}
            </div>
          </div>
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
export default NewPersonalDetailsCard;
