import FormFunctions from "./FormFunctions";

function ProfilePageFormFunctions() {
  const { handleInputChange } = FormFunctions();

  const alertIfOtherFormsOpen = (isEditingForms) => {
    const {
      isEditingPersonalDetails,
      isChangingPassword,
      isEditingAddress,
      isEditingPaymentMethod,
    } = isEditingForms;

    if (
      isEditingPersonalDetails ||
      isChangingPassword ||
      isEditingAddress ||
      isEditingPaymentMethod
    ) {
      alert("You must close the other forms before opening a new one");
      return true;
    }
    return false;
  };

  const handleEditFormClick = (
    alertIfOtherFormsOpen,
    isEditingForms,
    setIsEditing,
    setConfirmAction,
    setFormData,
    user,
    actionType
  ) => {
    if (alertIfOtherFormsOpen(isEditingForms)) return;
    setIsEditing(true);
    setConfirmAction(actionType);

    if (actionType === "personalDetails") {
      setFormData({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      });
    } else if (actionType === "address") {
      setFormData({
        address: user.address.address || "",
        city: user.address.city || "",
        region: user.address.region || "",
        zipCode: user.address.zipCode || "",
        country: user.address.country || "",
        phone: user.address.phone || "",
      });
    } else if (actionType === "paymentMethod") {
      setFormData({
        method: user.paymentMethod.method || "",
        number: user.paymentMethod.number || "",
        expiration: user.paymentMethod.expiration || "",
        CVV: user.paymentMethod.CVV || "",
      });
    }
  };

  const handleGoBack = (
    formData,
    action,
    getChangedFields,
    setShowModal,
    closeRelevantForm,
    userPersonalDetails,
    userAddress,
    userPaymentMethod
  ) => {
    let changesInFields = {};

    if (action === "personalDetails") {
      changesInFields = getChangedFields(userPersonalDetails, formData);
    }
    if (action === "address") {
      changesInFields = getChangedFields(userAddress, formData);
    }
    if (action === "paymentMethod") {
      changesInFields = getChangedFields(userPaymentMethod, formData);
    }
    if (action === "password") {
      changesInFields = 1;
    }

    if (Object.keys(changesInFields).length !== 0) {
      setShowModal(true);
    } else {
      closeRelevantForm(action);
    }
  };

  const closeRelevantForm = (
    action,
    setIsEditingPersonalDetails,
    setIsEditingPaymentMethod,
    setIsEditingAddress,
    setIsChangingPassword,
    setConfirmAction
  ) => {
    if (action === "personalDetails") {
      setIsEditingPersonalDetails(false);
      setConfirmAction("");
    }
    if (action === "address") {
      setIsEditingAddress(false);
      setConfirmAction("");
    }
    if (action === "paymentMethod") {
      setIsEditingPaymentMethod(false);
      setConfirmAction("");
    }
    if (action === "password") {
      setIsChangingPassword(false);
      setConfirmAction("");
    }
  };

  const handleConfirm = (confirmAction, setShowModal, closeRelevantForm) => {
    setShowModal(false);
    closeRelevantForm(confirmAction);
  };

  const getChangedFields = (oldData, formData) => {
    if (Object.keys(oldData).includes("oldPassword")) return { changed: true };
    const changedFields = {};
    for (const key in oldData) {
      if (oldData[key] !== formData[key]) {
        changedFields[key] = formData[key];
      }
    }
    return changedFields;
  };

  const handlePersonalDetailsSubmit = (
    e,
    getChangedFields,
    userPersonalDetails,
    handleUserUpdate,
    setIsEditingPersonalDetails,
    formData
  ) => {
    e.preventDefault();

    const changedFields = getChangedFields(userPersonalDetails, formData);
    if (Object.keys(changedFields).length > 0) {
      handleUserUpdate(changedFields, "personalDetails");
    }
    setIsEditingPersonalDetails(false);
    // Optionally update the user context here
  };

  const handleAddressSubmit = (
    e,
    getChangedFields,
    userAddress,
    handleUserUpdate,
    setIsEditingAddress,
    formData
  ) => {
    e.preventDefault();

    const changedFields = getChangedFields(userAddress, formData);

    if (Object.keys(changedFields).length > 0) {
      handleUserUpdate(changedFields, "address");
      setIsEditingAddress(false);
    }
  };

  const handlePaymentMethodSubmit = (
    e,
    getChangedFields,
    userPaymentMethod,
    handleUserUpdate,
    setIsEditingPaymentMethod,
    formData
  ) => {
    e.preventDefault();
    const changedFields = getChangedFields(userPaymentMethod, formData);

    if (Object.keys(changedFields).length > 0) {
      handleUserUpdate(changedFields, "paymentMethod");
      setIsEditingPaymentMethod(false);
    }
  };

  const handlePasswordSubmit = (
    e,
    getChangedFields,
    handleUserUpdate,
    setIsChangingPassword,
    formData
  ) => {
    e.preventDefault();
    const changedFields = getChangedFields(formData, "password");

    if (Object.keys(changedFields).length > 0) {
      handleUserUpdate(formData, "password");
      setIsChangingPassword(false);
    }
  };

  return {
    handleInputChange,
    alertIfOtherFormsOpen,
    handleEditFormClick,
    handleGoBack,
    closeRelevantForm,
    handleConfirm,
    getChangedFields,
    handlePersonalDetailsSubmit,
    handleAddressSubmit,
    handlePaymentMethodSubmit,
    handlePasswordSubmit,
  };
}

export default ProfilePageFormFunctions;
