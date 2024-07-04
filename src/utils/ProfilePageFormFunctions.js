import { trimObjectValues, validatePersonalDetails } from "./DataValidation";
import { showToast } from "./Toast";
const ADDRESS_FIELDS = 6;
const PAYMENT_FIELDS = 4;
const PASSWORD_FIELDS = 2;
function ProfilePageFormFunctions() {
  const isDataEmptyStrings = (data) => {
    return Object.values(data).every((value) => value === "");
  };

  const getChangedFields = (oldData, formData) => {
    // If the form is being filled from scratch (add details)
    if (isDataEmptyStrings(oldData)) return "isNewData";

    const changedFields = {};

    // Ignore undefined values:
    // only compare the formData with existing fields in oldData
    for (const key in oldData) {
      if (oldData[key] !== formData[key] && formData[key] !== undefined) {
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
    } else if (actionType === "password") {
      setFormDataCallback({
        oldPassword: "",
        newPassword: "",
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
    userComparisonDetailsCallback
  ) => {
    let changesInFields = {};

    changesInFields = getChangedFields(userComparisonDetailsCallback, formData);

    // If there are changes in the fields,
    // OR the data in form is new to user object
    // OR the user has made changes to formData
    //THEN alert user about losing changes
    if (
      (Object.keys(changesInFields).length !== 0 &&
        changesInFields !== "isNewData") ||
      (changesInFields === "isNewData" && !isDataEmptyStrings(formData))
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

  // Called by PersonalForm. Handles changes of user.name, lastName and email fields
  const handlePersonalDetailsSubmit = (
    e,
    getChangedFields,
    userPersonalDetails,
    handleUserUpdate,
    setIsEditingPersonalDetails,
    formData
  ) => {
    e.preventDefault();

    // Trim all empty strings from formData
    const trimmedFormData = trimObjectValues(formData);

    // Validate personal details data
    const hasErrors = validatePersonalDetails(trimmedFormData);

    // In case of errors, warn user and return
    if (hasErrors) {
      showToast(hasErrors, "warning");
      return;
    }

    // Compare changes between user state and form data
    const changedFields = getChangedFields(
      userPersonalDetails,
      trimmedFormData
    );
    if (Object.keys(changedFields).length > 0) {
      // If so, handle patch/post request
      handleUserUpdate(changedFields, "personalDetails");
    }
    // If there are no changes, close form and do nothing
    setIsEditingPersonalDetails(false);
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
