import React, { useState, useContext } from "react";
import "./CheckOut.css";
import axios from "axios";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";
import FormFunctions from "../../utils/FormFunctions";
import authService from "../../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { handleInputChange } = FormFunctions();

function CheckOut() {
  const { user, updateUserStateAndLocalStorage } = useContext(AuthContext);
  const { cart, mealPlan, emptyCart } = useContext(CartContext);

  const navigate = useNavigate();

  const renderedUser = user ? user : JSON.parse(localStorage.getItem("user"));

  // state for the address

  const [addressForm, setAddressForm] = useState(
    renderedUser && renderedUser.address
      ? renderedUser.address
      : {
          address: "",
          city: "",
          region: "",
          zipCode: "",
          country: "",
          phone: "",
        }
  );

  //State for the PaymentData

  const [paymentMethodForm, setPaymentMethodForm] = useState({
    method: "Credit Card",
    number: renderedUser?.paymentMethod?.number || "",
    expiration: renderedUser?.paymentMethod?.expiration || "",
    CVV: renderedUser?.paymentMethod?.CVV || "",
  });

  //State for messages

  const [message, setMessage] = useState("");

  //State for delivery days

  const [deliveryDay, setDeliveryDay] = useState(["Monday"]);

  // function to handle the delivery

  const handleDeliveryDayChange = (e) => {
    const { options } = e.target;
    const selectedOptions = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value);
      }
    }
    setDeliveryDay(selectedOptions);
  };

  //function to post the data necessary to the subscription: address, delivery day and payment

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subscriptionData = {
      shippingAddress: {
        address: addressForm.address,
        city: addressForm.city,
        region: addressForm.region,
        zipCode: addressForm.zipCode,
        country: addressForm.country,
        phone: addressForm.phone,
      },

      renderedUser: addressForm.renderedUser,
      mealPlan: mealPlan._id,
      dishes: cart.map((item) => item._id),
      deliveryDay,
      paymentMethod: {
        method: paymentMethodForm.method,
        number: paymentMethodForm.number,
        expiration: paymentMethodForm.expiration,
        CVV: paymentMethodForm.CVV,
      },
    };

    try {
      const response = await authService.postSubscription(subscriptionData);

      updateUserStateAndLocalStorage(response.data, "subscription");

      setMessage("Successfully saved address and payment method!");

      // reset the values once submitted

      setAddressForm({
        address: "",
        city: "",
        region: "",
        zipCode: "",
        country: "",
        phone: "",
        renderedUser: renderedUser ? renderedUser._id : null,
      });
      setPaymentMethodForm({
        method: "",
        number: "",
        expiration: "",
        CVV: "",
      });

      // setting delivery to initial state
      setDeliveryDay([]);

      // callback for empty cart

      emptyCart();

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error saving the address or payment method:", error);
      setMessage("Failed to save address or payment method.");
    }
  };

  //control just in case...

  if (!mealPlan) {
    return <h1>Get a meal plan first!!!</h1>;
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
      <div>
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <p>Name: {item.name}</p>
          </div>
        ))}
      </div>

      {renderedUser && (
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

            <h4>Choose a delivery day</h4>
            <div>
              <select
                name="deliveryDay"
                value={deliveryDay}
                onChange={handleDeliveryDayChange}
                required
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                  (day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  )
                )}
              </select>
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

            <button type="submit" onClick={() => handleSubmit}>
              Submit
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </form>
          {message && <script>alert("Subscription completed!");</script>}
        </div>
      )}
    </div>
  );
}

export default CheckOut;
