import React, { useState, useContext } from "react";
import "./ProfilePage.css";
import { AuthContext } from "../../context/auth.context";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [isEditingPersonalDetails, setIsEditingPersonalDetails] =
    useState(false);
  const [isEditingPaymentMethod, setIsEditingPaymentMethod] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleEditPersonalDetailsClick = () => {
    setIsEditingPersonalDetails(true);
    setFormData({
      name: user.name || "",
      lastName: user.lastName || "",
      email: user.email || "",
      address: user.address ? user.address.address : "",
    });
  };

  const handleEditPaymentMethodClick = () => {
    setIsEditingPaymentMethod(true);
    setFormData({
      method: user.paymentMethod.method || "",
      number: user.paymentMethod.number || "",
      expiration: user.paymentMethod.expiration || "",
      CVV: user.paymentMethod.CVV || "",
    });
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setPasswordData({ currentPassword: "", newPassword: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePersonalDetailsSubmit = (e) => {
    e.preventDefault();
    // Submit the personal details form data to the server or update the user state
    setIsEditingPersonalDetails(false);
    // Optionally update the user context here
  };

  const handlePaymentMethodSubmit = (e) => {
    e.preventDefault();
    // Submit the payment method form data to the server or update the user state
    setIsEditingPaymentMethod(false);
    // Optionally update the user context here
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    // Submit the change password form data to the server
    setIsChangingPassword(false);
    // Optionally update the user context here
  };

  const handleGoBack = () => {
    setIsEditingPersonalDetails(false);
    setIsEditingPaymentMethod(false);
    setIsChangingPassword(false);
  };

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <div className="profile-columns">
        <div className="profile-column">
          <h2>Personal Details</h2>
          {isEditingPersonalDetails ? (
            <form onSubmit={handlePersonalDetailsSubmit}>
              <div className="profile-item">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-item">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="button-group">
                <button type="submit">Save</button>
                <button type="button" onClick={handleGoBack}>
                  Go Back Without Saving
                </button>
              </div>
            </form>
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
              <button onClick={handleEditPersonalDetailsClick}>
                Edit Personal Details
              </button>
            </>
          )}
          {isEditingPaymentMethod ? (
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
                <button type="submit">Save</button>
                <button type="button" onClick={handleGoBack}>
                  Go Back Without Saving
                </button>
              </div>
            </form>
          ) : (
            <button onClick={handleEditPaymentMethodClick}>
              Edit Payment Method
            </button>
          )}
          {isChangingPassword ? (
            <form onSubmit={handleChangePasswordSubmit}>
              <div className="profile-item">
                <label>Current Password:</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div className="profile-item">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                />
              </div>
              <div className="button-group">
                <button type="submit">Change Password</button>
                <button type="button" onClick={handleGoBack}>
                  Go Back Without Saving
                </button>
              </div>
            </form>
          ) : (
            <button onClick={handleChangePasswordClick}>Change Password</button>
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
                <div>
                  Created At:{" "}
                  {new Date(user.activeSubscription.createdAt).toLocaleString()}
                </div>
                <div>
                  Updated At:{" "}
                  {new Date(user.activeSubscription.updatedAt).toLocaleString()}
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
    </div>
  );
}

export default ProfilePage;
