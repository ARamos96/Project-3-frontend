import React, { useState, useContext } from "react";
import "./ProfilePage.css";
import { AuthContext } from "../../context/auth.context";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import PersonalForm from "../../components/Forms/PersonalForm";
import AddressForm from "../../components/Forms/AddressForm";
import PaymentMethodForm from "../../components/Forms/PaymentMethodForm";
import PasswordForm from "../../components/Forms/PasswordForm";
import ProfilePageFormFunctions from "../../utils/ProfilePageFormFunctions";
import FormFunctions from "../../utils/FormFunctions";

function ProfilePage() {
  const { handleUserUpdate, user } = useContext(AuthContext);

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

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div
        className="profile-columns"
        style={{ display: "flex", flexWrap: "wrap" }}
      >
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
                  {user.address.city}, {user.address.region},{" "}
                  {user.address.zipCode}, {user.address.country},{" "}
                  {user.address.phone}
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
                handleInputChange(
                  e,
                  setPaymentMethodDetails,
                  paymentMethodDetails
                )
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
        {(user.activeSubscription ||
          user.favDishes ||
          user.previousSubscriptions) && (
          <div style={{ flex: "1 1 0%", minWidth: 300, padding: 10 }}>
            <h2>Activity</h2>
            {user.activeSubscription && (
              <div className="profile-item">
                <strong>Active Subscription:</strong>
                <div>
                  Shipping Address:{" "}
                  {user.activeSubscription.shippingAddress.address},{" "}
                  {user.activeSubscription.shippingAddress.city},{" "}
                  {user.activeSubscription.shippingAddress.region},{" "}
                  {user.activeSubscription.shippingAddress.zipCode},{" "}
                  {user.activeSubscription.shippingAddress.country},{" "}
                  {user.activeSubscription.shippingAddress.phone}
                </div>
                <div>
                  Meal Plan: {user.activeSubscription.mealPlan.diet.join(", ")}{" "}
                  for {user.activeSubscription.mealPlan.numberOfPeople} people,{" "}
                  {user.activeSubscription.mealPlan.dishesPerWeek} dishes/week,
                  ${user.activeSubscription.mealPlan.price}
                </div>
                <div>
                  Dishes:
                  <ul>
                    {user.activeSubscription.dishes.map((dish) => (
                      <li key={dish._id}>
                        <strong>{dish.name}</strong> - {dish.price}$
                        <div>
                          {dish.categories.origin.join(", ")},{" "}
                          {dish.categories.diet.join(", ")}, Cooking time:{" "}
                          {dish.cookingTime} minutes
                        </div>
                        <div>
                          Nutritional Value:{" "}
                          {dish.nutritionalValuePerServing.calories} calories,{" "}
                          {dish.nutritionalValuePerServing.fat}g fat,{" "}
                          {dish.nutritionalValuePerServing.protein}g protein,{" "}
                          {dish.nutritionalValuePerServing.carbohydrates}g
                          carbs, {dish.nutritionalValuePerServing.fiber}g fiber
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  Delivery Days:{" "}
                  {user.activeSubscription.deliveryDay.join(", ")}
                </div>
                <div>
                  Payment Method: {user.activeSubscription.paymentMethod.method}{" "}
                  ending in{" "}
                  {user.activeSubscription.paymentMethod.number.slice(-4)}, Exp:{" "}
                  {user.activeSubscription.paymentMethod.expiration}
                </div>
              </div>
            )}
            {user.favDishes && (
              <div className="profile-item">
                <strong>Fav Dishes:</strong>
                <ul>
                  {user.favDishes.map((dish) => (
                    <li key={dish._id}>
                      <strong>{dish.name}</strong> - {dish.price}$
                      <div>
                        {dish.categories.origin.join(", ")},{" "}
                        {dish.categories.diet.join(", ")}, Cooking time:{" "}
                        {dish.cookingTime} minutes
                      </div>
                      <div>
                        Nutritional Value:{" "}
                        {dish.nutritionalValuePerServing.calories} calories,{" "}
                        {dish.nutritionalValuePerServing.fat}g fat,{" "}
                        {dish.nutritionalValuePerServing.protein}g protein,{" "}
                        {dish.nutritionalValuePerServing.carbohydrates}g carbs,{" "}
                        {dish.nutritionalValuePerServing.fiber}g fiber
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {user.previousSubscriptions && (
              <div className="profile-item">
                <strong>Previous Subscriptions:</strong>
                {user.previousSubscriptions.map((subscription, index) => (
                  <div key={index}>
                    <div>Subscription ID: {subscription._id}</div>
                    <div>
                      Shipping Address: {subscription.shippingAddress.address},{" "}
                      {subscription.shippingAddress.city},{" "}
                      {subscription.shippingAddress.region},{" "}
                      {subscription.shippingAddress.zipCode},{" "}
                      {subscription.shippingAddress.country},{" "}
                      {subscription.shippingAddress.phone}
                    </div>
                    <div>
                      Meal Plan: {subscription.mealPlan.diet.join(", ")} for{" "}
                      {subscription.mealPlan.numberOfPeople} people,{" "}
                      {subscription.mealPlan.dishesPerWeek} dishes/week, $
                      {subscription.mealPlan.price}
                    </div>
                    <div>
                      Dishes:
                      <ul>
                        {subscription.dishes.map((dish) => (
                          <li key={dish._id}>
                            <strong>{dish.name}</strong> - {dish.price}$
                            <div>
                              {dish.categories.origin.join(", ")},{" "}
                              {dish.categories.diet.join(", ")}, Cooking time:{" "}
                              {dish.cookingTime} minutes
                            </div>
                            <div>
                              Nutritional Value:{" "}
                              {dish.nutritionalValuePerServing.calories}{" "}
                              calories, {dish.nutritionalValuePerServing.fat}g
                              fat, {dish.nutritionalValuePerServing.protein}g
                              protein,{" "}
                              {dish.nutritionalValuePerServing.carbohydrates}g
                              carbs, {dish.nutritionalValuePerServing.fiber}g
                              fiber
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      Delivery Days: {subscription.deliveryDay.join(", ")}
                    </div>
                    <div>
                      Payment Method: {subscription.paymentMethod.method} ending
                      in {subscription.paymentMethod.number.slice(-4)}, Exp:{" "}
                      {subscription.paymentMethod.expiration}
                    </div>
                    <div>
                      Created At:{" "}
                      {new Date(subscription.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
