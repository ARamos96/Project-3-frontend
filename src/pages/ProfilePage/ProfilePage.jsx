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

function ProfilePage() {
  const { handleUserUpdate, user, setUser, setUserInStorage } =
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

  const {
    handleInputChange,
    handleEditFormClick,
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

  // Subset of personalDetails in user context
  const userPersonalDetails = {
    name: user.name,
    lastName: user.lastName,
    email: user.email,
  };

  const userAddress = {
    address: user.address.address,
    city: user.address.city,
    region: user.address.region,
    zipCode: user.address.zipCode,
    country: user.address.country,
    phone: user.address.phone,
  };

  const userPaymentMethod = {
    method: user.paymentMethod.method,
    number: user.paymentMethod.number,
    expiration: user.paymentMethod.expiration,
    CVV: user.paymentMethod.CVV,
  };

  // Form data state
  const [formData, setFormData] = useState({});

  // Modal controls
  const [showModal, setShowModal] = useState(false);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="profile-columns">
        <div className="profile-column">
          <h2>Personal Details</h2>
          {isEditingPersonalDetails ? (
            <PersonalForm
              formData={formData}
              handleInputChange={(e) =>
                handleInputChange(e, setFormData, formData)
              }
              handlePersonalDetailsSubmit={(e) =>
                handlePersonalDetailsSubmit(
                  e,
                  getChangedFields,
                  userPersonalDetails,
                  handleUserUpdate,
                  setIsEditingPersonalDetails,
                  formData
                )
              }
              handleGoBack={() =>
                handleGoBack(
                  formData,
                  "personalDetails",
                  getChangedFields,
                  setShowModal,
                  (action) =>
                    closeRelevantForm(
                      action,
                      setIsEditingPersonalDetails,
                      setIsEditingPaymentMethod,
                      setIsEditingAddress,
                      setIsChangingPassword,
                      setConfirmAction
                    ),
                  userPersonalDetails,
                  userAddress,
                  userPaymentMethod
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
                    setFormData,
                    user,
                    "personalDetails"
                  )
                }
              >
                Edit Personal Details
              </button>
            </>
          )}
          {isEditingAddress ? (
            <AddressForm
              formData={formData}
              handleInputChange={(e) =>
                handleInputChange(e, setFormData, formData)
              }
              handleAddressSubmit={(e) =>
                handleAddressSubmit(
                  e,
                  getChangedFields,
                  userAddress,
                  handleUserUpdate,
                  setIsEditingAddress,
                  formData
                )
              }
              handleGoBack={() =>
                handleGoBack(
                  formData,
                  "address",
                  getChangedFields,
                  setShowModal,
                  (action) =>
                    closeRelevantForm(
                      action,
                      setIsEditingPersonalDetails,
                      setIsEditingPaymentMethod,
                      setIsEditingAddress,
                      setIsChangingPassword,
                      setConfirmAction
                    ),
                  userPersonalDetails,
                  userAddress,
                  userPaymentMethod
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
                  setFormData,
                  user,
                  "address"
                )
              }
            >
              Edit Address
            </button>
          )}

          {isEditingPaymentMethod ? (
            <PaymentMethodForm
              formData={formData}
              handleInputChange={(e) =>
                handleInputChange(e, setFormData, formData)
              }
              handlePaymentMethodSubmit={(e) =>
                handlePaymentMethodSubmit(
                  e,
                  getChangedFields,
                  userPaymentMethod,
                  handleUserUpdate,
                  setIsEditingPaymentMethod,
                  formData
                )
              }
              handleGoBack={() =>
                handleGoBack(
                  formData,
                  "paymentMethod",
                  getChangedFields,
                  setShowModal,
                  (action) =>
                    closeRelevantForm(
                      action,
                      setIsEditingPersonalDetails,
                      setIsEditingPaymentMethod,
                      setIsEditingAddress,
                      setIsChangingPassword,
                      setConfirmAction
                    ),
                  userPersonalDetails,
                  userAddress,
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
                  setFormData,
                  user,
                  "paymentMethod"
                )
              }
            >
              Edit Payment Method
            </button>
          )}
          {isChangingPassword ? (
            <PasswordForm
              formData={formData}
              handleInputChange={(e) =>
                handleInputChange(e, setFormData, formData)
              }
              handlePasswordSubmit={(e) =>
                handlePasswordSubmit(
                  e,
                  getChangedFields,
                  handleUserUpdate,
                  setIsChangingPassword,
                  formData
                )
              }
              handleGoBack={() =>
                handleGoBack(
                  formData,
                  "password",
                  getChangedFields,
                  setShowModal,
                  (action) =>
                    closeRelevantForm(
                      action,
                      setIsEditingPersonalDetails,
                      setIsEditingPaymentMethod,
                      setIsEditingAddress,
                      setIsChangingPassword,
                      setConfirmAction
                    ),
                  userPersonalDetails,
                  userAddress,
                  userPaymentMethod
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
                  setFormData,
                  user,
                  "password"
                )
              }
            >
              Change Password
            </button>
          )}
        </div>
        {(user.activeSubscription ||
          user.favDishes.length ||
          user.previousSubscriptions.length) && (
          <div className="profile-column">
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
            {user.favDishes.length > 0 && (
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
            {user.previousSubscriptions.length > 0 && (
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
                    <div>
                      Updated At:{" "}
                      {new Date(subscription.updatedAt).toLocaleString()}
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
          handleConfirm(confirmAction, setShowModal, (action) =>
            closeRelevantForm(
              action,
              setIsEditingPersonalDetails,
              setIsEditingPaymentMethod,
              setIsEditingAddress,
              setIsChangingPassword,
              setConfirmAction
            )
          )
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
