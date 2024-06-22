import FormFunctions from "./FormFunctions";

const ADDRESS_FIELDS = 6;
const PAYMENT_FIELDS = 4;
const PASSWORD_FIELDS = 2;

function ProfilePageFormFunctions() {
  const isDataEmptyStrings = (data) => {
    return Object.values(data).every((value) => value === "");
  };

  const getChangedFields = (oldData, formData) => {
    if (
      Object.keys(oldData).includes("oldPassword") ||
      isDataEmptyStrings(oldData)
    )
      return "isNewData";
    const changedFields = {};
    for (const key in oldData) {
      if (oldData[key] !== formData[key]) {
        changedFields[key] = formData[key];
      }
    }
    return changedFields;
  };

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
    setFormDataCallback,
    user,
    actionType
  ) => {
    if (alertIfOtherFormsOpen(isEditingForms)) return;
    setIsEditing(true);
    setConfirmAction(actionType);

    if (actionType === "personalDetails") {
      setFormDataCallback({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      });
    } else if (actionType === "address") {
      if (!user.address) {
        setFormDataCallback({});
      } else {
        setFormDataCallback({
          address: user.address.address || "",
          city: user.address.city || "",
          region: user.address.region || "",
          zipCode: user.address.zipCode || "",
          country: user.address.country || "",
          phone: user.address.phone || "",
        });
      }
    } else if (actionType === "paymentMethod") {
      if (!user.paymentMethod) {
        setFormDataCallback({});
      } else {
        setFormDataCallback({
          method: user.paymentMethod.method || "",
          number: user.paymentMethod.number || "",
          expiration: user.paymentMethod.expiration || "",
          CVV: user.paymentMethod.CVV || "",
        });
      }
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
    } else if (action === "address") {
      changesInFields = getChangedFields(userAddress, formData);
    } else if (action === "paymentMethod") {
      changesInFields = getChangedFields(userPaymentMethod, formData);
    } else if (action === "password") {
      changesInFields = 1;
    }

    // If there are changes in the fields,
    // OR the data in form is new to user object
    // OR the user has made changes to formData
    //THEN alert user about losing changes
    if (
      Object.keys(changesInFields).length !== 0 &&
      changesInFields === "isNewData" &&
      !isDataEmptyStrings(formData)
    ) {
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

    let minimumFields = 0;

    let isPost = false;

    let changedFields = getChangedFields(userAddress, formData);

    if (changedFields === "isNewData") {
      changedFields = formData;
      minimumFields = ADDRESS_FIELDS;
      isPost = true;
    }

    validateAndSubmit(
      changedFields,
      isPost,
      "address",
      minimumFields,
      handleUserUpdate,
      setIsEditingAddress
    );
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

    let minimumFields = 0;

    let isPost = false;

    let changedFields = getChangedFields(userPaymentMethod, formData);

    if (changedFields === "isNewData") {
      changedFields = formData;
      minimumFields = PAYMENT_FIELDS;
      isPost = true;
    }

    validateAndSubmit(
      changedFields,
      isPost,
      "paymentMethod",
      minimumFields,
      handleUserUpdate,
      setIsEditingPaymentMethod
    );
  };

  const handlePasswordSubmit = (
    e,
    getChangedFields,
    handleUserUpdate,
    setIsChangingPassword,
    formData
  ) => {
    e.preventDefault();

    let minimumFields = 0;

    let changedFields = getChangedFields(formData, "password");

    if (changedFields === "isNewData") {
      changedFields = formData;
      minimumFields = PASSWORD_FIELDS;
    }

    validateAndSubmit(
      changedFields,
      false,
      "password",
      minimumFields,
      handleUserUpdate,
      setIsChangingPassword
    );
  };

  const validateAndSubmit = (
    changedFields,
    isPost,
    updateType,
    minimumFields,
    handleUserUpdate,
    setIsEditingCallback
  ) => {
    if (Object.keys(changedFields).length > minimumFields - 1) {
      handleUserUpdate(changedFields, updateType, isPost);
      setIsEditingCallback(false);
    } else if (isPost) {
      alert("Please fill out all the required fields");
      return;
    }
  };

  return {
    isDataEmptyStrings,
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
