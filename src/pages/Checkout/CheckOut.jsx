import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CheckOut.css";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";
import FormFunctions from "../../utils/FormFunctions";
import authService from "../../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading.jsx";
import Modal from "../../components/Modal/Modal.jsx";
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

  const validatePaymentMethod = (paymentMethodForm) => {
    const { method, number, expiration, CVV } = paymentMethodForm;

    if (!method || !number || !expiration || !CVV) {
      return { isValid: false, message: "All payment fields must be filled." };
    }

    const cardNumberPattern = /^\d{16}$/;
    if (!cardNumberPattern.test(number)) {
      return {
        isValid: false,
        message: "Card number must be 16 digits long and contain only numbers.",
      };
    }

    const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expirationPattern.test(expiration)) {
      return {
        isValid: false,
        message: "Expiration date must be in MM/YY format.",
      };
    }

    const cvvPattern = /^\d{3}$/;
    if (!cvvPattern.test(CVV)) {
      return {
        isValid: false,
        message: "CVV must be 3 digits long and contain only numbers.",
      };
    }

    return { isValid: true, message: "Payment method is valid." };
  };

  const validateAddress = (addressForm) => {
    const { address, city, region, zipCode, country, phone } = addressForm;

    if (!address || !city || !region || !zipCode || !country || !phone) {
      return { isValid: false, message: "All fields must be filled." };
    }

    const zipCodePattern = /^\d+$/;
    if (!zipCodePattern.test(zipCode)) {
      return { isValid: false, message: "Zip Code must contain only numbers." };
    }

    const phonePattern = /^\d+$/;
    if (!phonePattern.test(phone)) {
      return {
        isValid: false,
        message: "Phone number must contain only numbers.",
      };
    }

    return { isValid: true, message: "Address is valid." };
  };

  const validateDeliveryDay = (data) => {
    if (data.length === 0) {
      return {
        isValid: false,
        message: "You must select at least one delivery day.",
      };
    }
    return { isValid: true, message: "Delivery day is valid." };
  };

  const showToast = (message) => {
    if (typeof message === "string") {
      toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (Array.isArray(message)) {
      message.forEach((message) => {
        toast.error(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    }
  };

  useEffect(() => {
    if (isActiveSubscriptionInUser()) {
      const reorderDate = getSubscriptionReorderDate(
        user.activeSubscription.createdAt
      );

      toast.error(
        `You already have an active subscription. You can start a new one on ${reorderDate} `,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      navigate("/profile");

      return;
    }
    // When user is loaded, populate forms with user data if available
    else if (!user && !mealPlan) {
      toast.error(`You need to log in and create a meal plan first!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

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

    const addressValidation = validateAddress(allForms.addressForm);
    const paymentValidation = validatePaymentMethod(allForms.paymentMethodForm);
    const deliveryDayValidation = validateDeliveryDay(allForms.deliveryDay);
    if (
      !addressValidation.isValid &&
      !paymentValidation.isValid &&
      !deliveryDayValidation.isValid
    ) {
      showToast([
        ...addressValidation.message,
        ...paymentValidation.message,
        ...deliveryDayValidation.message,
      ]);
      return;
    } else if (!addressValidation.isValid) {
      showToast(addressValidation.message);
      return;
    } else if (!paymentValidation.isValid) {
      showToast(paymentValidation.message);
      return;
    } else if (!deliveryDayValidation.isValid) {
      showToast(deliveryDayValidation.message);
      return;
    }

    const subscriptionData = {
      shippingAddress: addressForm,
      mealPlan: mealPlan,
      user: user._id,
      dishes: cart.map((item) => item._id),
      deliveryDay,
      paymentMethod: paymentMethodForm,
    };

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
    }
    else if (
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

      toast.success("Your subscription has been confirmed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

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
      toast.error(`Oops! Something went wrong. Please try again`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!mealPlan) {
    return toast.error("Please choose a Meal Plan first!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  return (
    <div>
      <h2>Subscription summary</h2>

      <h3>Your meal plan</h3>

      {mealPlan && (
        <div>
          <p>Number of People: {mealPlan.numberOfPeople}</p>
          <p>Dishes per week: {mealPlan.dishesPerWeek}</p>
          <p>Diet: {mealPlan.diet}</p>
          <p>Price: {mealPlan.price}</p>
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
          <form onSubmit={handleSubmit}>
            <h4>Address</h4>
            <div>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={addressForm.address}
                  onChange={(e) =>
                    handleInputChange(e, setAddressForm, addressForm)
                  }
                  required
                />
              </label>
            </div>
            <div>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={(e) =>
                    handleInputChange(e, setAddressForm, addressForm)
                  }
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Region:
                <input
                  type="text"
                  name="region"
                  value={addressForm.region}
                  onChange={(e) =>
                    handleInputChange(e, setAddressForm, addressForm)
                  }
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Zip Code:
                <input
                  type="text"
                  name="zipCode"
                  value={addressForm.zipCode}
                  onChange={(e) =>
                    handleInputChange(e, setAddressForm, addressForm)
                  }
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Country:
                <input
                  type="text"
                  name="country"
                  value={addressForm.country}
                  onChange={(e) =>
                    handleInputChange(e, setAddressForm, addressForm)
                  }
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={addressForm.phone}
                  onChange={(e) =>
                    handleInputChange(e, setAddressForm, addressForm)
                  }
                  required
                />
              </label>
            </div>
            <div>
              {user?.address ? (
                <label>
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
                  <input
                    type="checkbox"
                    name={"postAddressToUser"}
                    checked={saveToUserCheckboxes.postAddressToUser}
                    onChange={handleCheckboxChange}
                  />
                  Save this address to my profile
                </label>
              )}
            </div>

            <h4>Choose a delivery day</h4>
            <div>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                (day) => (
                  <div key={day}>
                    <label>
                      <input
                        type="checkbox"
                        name="deliveryDay"
                        value={day}
                        checked={deliveryDay.includes(day)}
                        onChange={handleDeliveryDayChange}
                      />
                      {day}
                    </label>
                  </div>
                )
              )}
            </div>

            <h4>Payment method</h4>
            <div>
              <label>
                Payment Method:
                <select
                  name="method"
                  value={paymentMethodForm.method}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      setPaymentMethodForm,
                      paymentMethodForm
                    )
                  }
                  required
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Card Number:
                <input
                  type="text"
                  name="number"
                  value={paymentMethodForm.number}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      setPaymentMethodForm,
                      paymentMethodForm
                    )
                  }
                  required
                  minLength="16"
                  maxLength="16"
                />
              </label>
            </div>
            <div>
              <label>
                Expiration Date (MM/YY):
                <input
                  type="text"
                  name="expiration"
                  value={paymentMethodForm.expiration}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      setPaymentMethodForm,
                      paymentMethodForm
                    )
                  }
                  required
                  minLength="5"
                  maxLength="5"
                />
              </label>
            </div>
            <div>
              <label>
                CVV:
                <input
                  type="text"
                  name="CVV"
                  value={paymentMethodForm.CVV}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      setPaymentMethodForm,
                      paymentMethodForm
                    )
                  }
                  required
                  minLength="3"
                  maxLength="3"
                />
              </label>
            </div>
            <div>
              {user?.paymentMethod ? (
                <label>
                  <input
                    type="checkbox"
                    name={"putPaymentToUser"}
                    checked={saveToUserCheckboxes.putPaymentToUser}
                    onChange={handleCheckboxChange}
                  />
                  Update my payment to this one
                </label>
              ) : (
                <label>
                  <input
                    type="checkbox"
                    name={"postPaymentToUser"}
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
          Address: ${addressForm.address}, ${addressForm.city}, ${
          addressForm.region
        }, ${addressForm.zipCode}, ${addressForm.country}
          Phone: ${addressForm.phone}
          Payment Method: ${
            paymentMethodForm.method
          } ending in ${paymentMethodForm.number.slice(-4)}
          Delivery Days: ${deliveryDay.join(", ")}`}
        confirmMessage="Confirm"
        closeMessage="Cancel"
      />
    </div>
  );
}

export default CheckOut;
