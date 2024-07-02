import React, { useState, useContext, useEffect } from "react";
import "./ProfilePage.css";
import { AuthContext } from "../../context/auth.context";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import ProfilePageFormFunctions from "../../utils/ProfilePageFormFunctions";
import FormFunctions from "../../utils/FormFunctions";
import PersonalDetailsCard from "../../components/ProfilePageDashboard/PersonalDetailsCard/PersonalDetailsCard";
import ActivityCard from "../../components/ProfilePageDashboard/ActivityCard/ActivityCard";
import authService from "../../services/auth.service";

function ProfilePage() {
  const { handleUserUpdate, isUserLoaded, user, checkIfUserDataIsLoaded } =
    useContext(AuthContext);

  // Controls the editing of each element
  const [isEditingPersonalDetails, setIsEditingPersonalDetails] =
    useState(false);
  const [isEditingPaymentMethod, setIsEditingPaymentMethod] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");

  const isEditingForms = {
    isEditingPersonalDetails,
    isEditingAddress,
    isEditingPaymentMethod,
    isChangingPassword,
  };

  const setIsEditingForms = {
    setIsEditingPersonalDetails,
    setIsEditingPaymentMethod,
    setIsEditingAddress,
    setIsChangingPassword,
  };

  const {
    handleEditFormClick,
    isDataEmptyStrings,
    handleGoBack,
    handleConfirm,
    closeRelevantForm,
    getChangedFields,
    handlePersonalDetailsSubmit,
    handleAddressSubmit,
    handlePaymentMethodSubmit,
    handlePasswordSubmit,
    alertIfOtherFormsOpen,
  } = ProfilePageFormFunctions();

  const { handleInputChange } = FormFunctions();

  const handleGoBackAction = (action) =>
    closeRelevantForm(
      action,
      setIsEditingPersonalDetails,
      setIsEditingPaymentMethod,
      setIsEditingAddress,
      setIsChangingPassword,
      setConfirmAction
    );

  // Subset of personalDetails in user context
  const userPersonalDetails = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  };

  const userAddress = user.address || {
    address: "",
    city: "",
    region: "",
    zipCode: "",
    country: "",
    phone: "",
  };

  const userPaymentMethod = user.paymentMethod || {
    method: "",
    number: "",
    expiration: "",
    CVV: "",
  };

  const userPassword = user.password || {
    oldPassword: "",
    newPassword: "",
  };

  // Form data states
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    lastName: "",
    email: "",
  });

  const [addressDetails, setAddressDetails] = useState({
    address: "",
    city: "",
    region: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethodDetails, setPaymentMethodDetails] = useState({
    method: "",
    number: "",
    expiration: "",
    CVV: "",
  });

  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // Modal controls
  const [showModal, setShowModal] = useState(false);

  const personalDetailsCardProps = {
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
    setConfirmAction,
    setIsEditingForms,
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
  };

  if (!user && !isUserLoaded) {
    return <Loading />;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div
        className="profile-columns"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
        <PersonalDetailsCard
          personalDetailsCardProps={personalDetailsCardProps}
        />
        <ActivityCard user={user} />
      </div>
      <Modal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={() =>
          handleConfirm(confirmAction, setShowModal, handleGoBackAction)
        }
        heading="Are you sure?"
        message="Your changes will be lost."
        confirmMessage="Yes"
        closeMessage="No"
      />
    </div>
  );
}

export default ProfilePage;
