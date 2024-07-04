import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CheckOut.css";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";
import FormFunctions from "../../utils/FormFunctions";
import authService from "../../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/Toast.js";
import Loading from "../../components/Loading/Loading.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import { TextField, Checkbox, FormControl, InputLabel, Select, MenuItem, Button, Box } from '@mui/material';
import moment from "moment";
import {
  validateAddress,
  validateDeliveryDay,
  validatePaymentMethod,
  trimObjectValues,
} from "../../utils/DataValidation.js";
const { handleInputChange } = FormFunctions();

function CheckOut() {
  const {
    user,
    updateUserStateAndLocalStorage,
    isActiveSubscriptionInUser,
    getSubscriptionReorderDate,
  } = useContext(AuthContext);
  const { cart, mealPlan, emptyCart, deleteMealPlan } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    region: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethodForm, setPaymentMethodForm] = useState({
    method: "Credit Card",
    number: "",
    expiration: "",
    CVV: "",
  });

  const [deliveryDay, setDeliveryDay] = useState(["Monday"]);

  const [saveToUserCheckboxes, setSaveToUserCheckboxes] = useState({
    putAddressToUser: false,
    putPaymentToUser: false,
    postAddressToUser: false,
    postPaymentToUser: false,
  });

  const allForms = { addressForm, paymentMethodForm, deliveryDay };

  const handleDeliveryDayChange = (e) => {
    const { value, checked } = e.target;
    setDeliveryDay((prevDays) =>
      checked ? [...prevDays, value] : prevDays.filter((day) => day !== value)
    );
  };

  const handleCheckboxChange = (e) => {
    let { name, checked } = e.target;
    setSaveToUserCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const getChangedFields = (oldData, formData) => {
    const changedFields = {};

    if (oldData === undefined) return { isNewDataToUser: true };
    // Ignore undefined values:
    // only compare the formData with existing fields in oldData
    for (const key in oldData) {
      if (oldData[key] !== formData[key] && formData[key] !== undefined) {
        changedFields[key] = formData[key];
      }
    }
    return changedFields;
  };

  useEffect(() => {
    if (isActiveSubscriptionInUser()) {
      const reorderDate = getSubscriptionReorderDate(
        user.activeSubscription.createdAt
      );

      showToast(
        `You already have an active subscription. You can start a new one on ${reorderDate} `,
        "error"
      );

      navigate("/profile");

      return;
    }
    // When user is loaded, populate forms with user data if available
    else if (!user && !mealPlan) {
      showToast(`You need to log in and create a meal plan first!`, "error");

      navigate("/");

      return;
    } else if (user && !isFormInitialized) {
      setAddressForm(user.address || addressForm);
      setPaymentMethodForm({
        method: "Credit Card",
        number: user?.paymentMethod?.number || "",
        expiration: user?.paymentMethod?.expiration || "",
        CVV: user?.paymentMethod?.CVV || "",
      });
      setLoading(false);
      setIsFormInitialized(true);
    }
  }, [
    getSubscriptionReorderDate,
    isActiveSubscriptionInUser,
    navigate,
    user,
    isFormInitialized,
    mealPlan,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const checkOutValidations = {
      address: validateAddress(allForms.addressForm),
      payment: validatePaymentMethod(allForms.paymentMethodForm),
      deliveryDay: validateDeliveryDay(allForms.deliveryDay),
    };

    Object.keys(checkOutValidations).forEach((key) => {
      const validationMessage = checkOutValidations[key];
      if (validationMessage) {
        showToast(validationMessage, "warning");
      }
    });

    // Continue only if there are no validation errors
    const hasErrors = Object.values(checkOutValidations).some(
      (msg) => msg.length > 0
    );

    if (hasErrors) {
      return;
    }

    let subscriptionData = {
      shippingAddress: addressForm,
      mealPlan: mealPlan,
      user: user._id,
      dishes: cart.map((item) => item._id),
      deliveryDay,
      paymentMethod: paymentMethodForm,
    };

    subscriptionData = trimObjectValues(subscriptionData);

    // Compare changes between user data and forms
    const changesInAddress = getChangedFields(user.address, addressForm);
    const changesInPaymentMethod = getChangedFields(
      user.paymentMethod,
      paymentMethodForm
    );

    // Update user data if there are any changes in address or payment method
    if (Object.keys(changesInAddress).length !== 0) {
      if (saveToUserCheckboxes.postAddressToUser)
        subscriptionData.shippingAddress.postToUser = true;
      else if (saveToUserCheckboxes.putAddressToUser)
        subscriptionData.shippingAddress.putToUser = true;
    }
    if (Object.keys(changesInPaymentMethod).length !== 0) {
      if (saveToUserCheckboxes.postPaymentToUser)
        subscriptionData.paymentMethod.postToUser = true;
      else if (saveToUserCheckboxes.putPaymentToUser)
        subscriptionData.paymentMethod.putToUser = true;
    }

    setSubscriptionData(subscriptionData);
    setShowModal(true);
  };

  const getClosestDeliveryDay = (deliveryDays) => {
    const today = moment();
    const validDeliveryDays = deliveryDays
      .map((day) => moment().day(day)) // Convert delivery days to moment objects
      .filter((day) => day.isAfter(today, "day")); // Filter out days that are today or earlier

    if (validDeliveryDays.length === 0) {
      return null; // No valid delivery days found
    }

    const closestDeliveryDay = validDeliveryDays.reduce((closest, current) => {
      return current.diff(today, "days") < closest.diff(today, "days")
        ? current
        : closest;
    });

    return closestDeliveryDay.format("dddd"); // Return the name of the closest delivery day
  };

  // Handle extra user updates - if user wants to add/edit payment or address
  const checkForExtraUserUpdates = () => {
    let extraUserUpdates = "";
    if (
      (saveToUserCheckboxes.putAddressToUser ||
        saveToUserCheckboxes.postAddressToUser) &&
      (saveToUserCheckboxes.putPaymentToUser ||
        saveToUserCheckboxes.postPaymentToUser)
    ) {
      extraUserUpdates = "addAddressAndPaymentMethodToUser";
    } else if (
      saveToUserCheckboxes.putAddressToUser ||
      saveToUserCheckboxes.postAddressToUser
    ) {
      extraUserUpdates = "addAddressToUser";
    } else if (
      saveToUserCheckboxes.putPaymentToUser ||
      saveToUserCheckboxes.postPaymentToUser
    ) {
      extraUserUpdates = "addPaymentMethodToUser";
    }

    return extraUserUpdates;
  };
  const handleConfirmPurchase = async () => {
    setShowModal(false);
    try {
      const response = await authService.postSubscription(subscriptionData);

      // Handle extra user updates
      const extraUserUpdates = checkForExtraUserUpdates();

      updateUserStateAndLocalStorage(
        response.data,
        "subscription",
        extraUserUpdates
      );

      const closestDeliveryDay = getClosestDeliveryDay(deliveryDay);

      showToast(
        `Your subscription has been confirmed!\nIt will arrive on ${closestDeliveryDay}`,
        "success"
      );

      // Reset forms
      setAddressForm({
        address: "",
        city: "",
        region: "",
        zipCode: "",
        country: "",
        phone: "",
      });
      setPaymentMethodForm({
        method: "",
        number: "",
        expiration: "",
        CVV: "",
      });

      setDeliveryDay([]);

      // Empty cart and delete meal plan
      emptyCart();
      deleteMealPlan();

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      showToast("Oops! Something went wrong. Please try again", "error");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!mealPlan) {
    showToast("Please choose a Meal Plan first!", "warning");
    return;
  }

  return (
    <div>
      <h2>Subscription summary</h2>

      <h3>Your meal plan</h3>

      {mealPlan && (
        <div className="mealPlan-info">
          <table class="meal-plan-table">
            <tr>
              <td>Number of People:</td>
              <td>{mealPlan.numberOfPeople}</td>
            </tr>
            <tr>
              <td>Dishes per week:</td>
              <td>{mealPlan.dishesPerWeek}</td>
            </tr>
            <tr>
              <td>Diet:</td>
              <td>{mealPlan.diet}</td>
            </tr>
            <tr>
              <td>Price:</td>
              <td>{mealPlan.price}</td>
            </tr>
          </table>
        </div>
      )}

      <h3>Your choices</h3>
      <div className="item-menu">
        {cart.map((item) => (
          <div
            className="item-container"
            key={item._id}
            style={{
              backgroundImage: `url(/${encodeURIComponent(item.name)}.jpg)`,
            }}
          >
            <Link to={`/recipes/${item._id}`}>
              <p>{item.name}</p>
              <div className="item-info">
                <p>
                  <span className="pi pi-stopwatch" /> {item.cookingTime}'
                </p>
                <p>{item.nutritionalValuePerServing.calories}kcal</p>
                <p>
                  {item.rating} <span className="pi pi-star-fill" />
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {user && (
        <div>
          <h3>Your details</h3>
          <form onSubmit={handleSubmit} >
            <h4>Address</h4>
            <div className="form-group">
              <TextField
                label="Address"
                type="text"
                name="address"
                value={addressForm.address}
                onChange={(e) => handleInputChange(e, setAddressForm)}
                required
                fullWidth
                margin="normal"
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                label="City"
                type="text"
                name="city"
                value={addressForm.city}
                onChange={(e) => handleInputChange(e, setAddressForm)}
                required
                fullWidth
                margin="normal"
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Region"
                type="text"
                name="region"
                value={addressForm.region}
                onChange={(e) => handleInputChange(e, setAddressForm)}
                required
                fullWidth
                margin="normal"
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Zip Code"
                type="text"
                name="zipCode"
                value={addressForm.zipCode}
                onChange={(e) => handleInputChange(e, setAddressForm)}
                required
                fullWidth
                margin="normal"
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Country"
                type="text"
                name="country"
                value={addressForm.country}
                onChange={(e) => handleInputChange(e, setAddressForm)}
                required
                fullWidth
                margin="normal"
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Phone"
                type="tel"
                name="phone"
                value={addressForm.phone}
                onChange={(e) => handleInputChange(e, setAddressForm)}
                required
                fullWidth
                margin="normal"
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div>
              {user?.address ? (
                <label>
                  <Checkbox
                    name="putAddressToUser"
                    value="putAddressToUser"
                    checked={saveToUserCheckboxes.putAddressToUser}
                    onChange={handleCheckboxChange}
                  />
                  <input
                    type="checkbox"
                    name={"putAddressToUser"}
                    checked={saveToUserCheckboxes.putAddressToUser}
                    onChange={handleCheckboxChange}
                  />
                  Update my address to this one
                </label>
              ) : (
                <label>
                  <Checkbox
                    name="postAddressToUser"
                    value="postAddressToUser"
                    checked={saveToUserCheckboxes.postAddressToUser}
                    onChange={handleCheckboxChange}

                  />

                  Save this address to my profile
                </label>
              )}
            </div>

            <h4>Choose a delivery day</h4>
            <div className="form-group">
              <label>
                <Checkbox
                  name="deliveryDay"
                  value="Monday"
                  checked={deliveryDay.includes("Monday")}
                  onChange={handleDeliveryDayChange}
                />
                Monday
              </label>
              <label>
                <Checkbox
                  name="deliveryDay"
                  value="Tuesday"
                  checked={deliveryDay.includes("Tuesday")}
                  onChange={handleDeliveryDayChange}
                />
                Tuesday
              </label>
              <label>
                <Checkbox
                  name="deliveryDay"
                  value="Wednesday"
                  checked={deliveryDay.includes("Wednesday")}
                  onChange={handleDeliveryDayChange}
                />
                Wednesday
              </label>
              <label>
                <Checkbox
                  name="deliveryDay"
                  value="Thursday"
                  checked={deliveryDay.includes("Thursday")}
                  onChange={handleDeliveryDayChange}
                />
                Thursday
              </label>
              <label>
                <Checkbox
                  name="deliveryDay"
                  value="Friday"
                  checked={deliveryDay.includes("Friday")}
                  onChange={handleDeliveryDayChange}
                />
                Friday
              </label>
            </div>

            <h4>Payment method</h4>
            <div className="payment-container" >
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="payment-method">Payment Method</InputLabel>
                <Select
                  native
                  value={paymentMethodForm.method}
                  onChange={(e) =>
                    handleInputChange(e, setPaymentMethodForm, paymentMethodForm)
                  }
                  inputProps={{
                    name: 'method',
                    id: 'payment-method',
                  }}
                  sx={{
                    backgroundColor: "white",
                    maxWidth: 400,
                    width: '100%',
                  }}
                  InputProps={{
                    style: {
                      borderColor: "yellow",
                    },
                  }}
                  required
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </Select>
              </FormControl>
            </div>
            <div className="form-group">
              <TextField
                label="Card Number"
                type="text"
                name="number"
                value={paymentMethodForm.number}
                onChange={(e) =>
                  handleInputChange(e, setPaymentMethodForm, paymentMethodForm)
                }
                required
                fullWidth
                inputProps={{
                  minLength: 16,
                  maxLength: 16,
                }}
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Expiration Date (MM/YY)"
                type="text"
                name="expiration"
                value={paymentMethodForm.expiration}
                onChange={(e) =>
                  handleInputChange(e, setPaymentMethodForm, paymentMethodForm)
                }
                required
                fullWidth
                inputProps={{
                  minLength: 5,
                  maxLength: 5,
                }}
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Expiration Date (MM/YY)"
                type="text"
                name="expiration"
                value={paymentMethodForm.expiration}
                onChange={(e) =>
                  handleInputChange(e, setPaymentMethodForm, paymentMethodForm)
                }
                required
                fullWidth
                inputProps={{
                  minLength: 5,
                  maxLength: 5,
                }}
                sx={{ backgroundColor: "white" }}
                InputProps={{
                  style: {
                    borderColor: "yellow",
                  },
                }}
                variant="outlined"
              />
            </div>
            <div>
              {user?.paymentMethod ? (
                <label>
                  <Checkbox
                    name="putPaymentToUser"
                    value="putPaymentToUser"
                    checked={saveToUserCheckboxes.putPaymentToUser}
                    onChange={handleCheckboxChange}
                  />

                  Update my payment to this one
                </label>
              ) : (
                <label>
                  <Checkbox
                    name="postPaymentToUser"
                    value="postPaymentToUser"
                    checked={saveToUserCheckboxes.postPaymentToUser}
                    onChange={handleCheckboxChange}
                  />

                  Save this payment to my profile
                </label>
              )}
            </div>

            <button type="submit">
              Submit
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </form>
        </div>
      )}

      <Modal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirmPurchase}
        heading="Please confirm your purchase"
        message={`Meal Plan Details:
          Number of People: ${mealPlan.numberOfPeople}
          Dishes per week: ${mealPlan.dishesPerWeek}
          Diet: ${mealPlan.diet}
          Price: ${mealPlan.price}
          Address: ${addressForm.address}, ${addressForm.city}, ${addressForm.region
          }, ${addressForm.zipCode}, ${addressForm.country}
          Phone: ${addressForm.phone}
          Payment Method: ${paymentMethodForm.method
          } ending in ${paymentMethodForm.number.slice(-4)}
          Delivery Days: ${deliveryDay.join(", ")}`}
        confirmMessage="Confirm"
        closeMessage="Cancel"
      />
    </div>
  );
}

export default CheckOut;
