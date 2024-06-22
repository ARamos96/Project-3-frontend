import React, { useState, useContext } from 'react';
import "./CheckOut.css";
import axios from 'axios';
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";
import FormFunctions from "../../utils/FormFunctions";

const { handleInputChange } = FormFunctions();

const MONGO_URI = "http://localhost:5005/subscription";



function CheckOut() {
  const { user } = useContext(AuthContext);
  const { cart, mealPlan } = useContext(CartContext);

// state for the address

  const [formData, setFormData] = useState({
    address: user?.address || '',
    city: user?.address?.city || '',
    region: user?.address?.region || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    phone: user?.address?.phone || '',
    user: user?._id || null,
    subscription: user?.subscription || '',
  });

 //State for the PaymentData

  const [paymentData, setPaymentData] = useState({
    method: user?.paymentMethod?.method || '',
    number: user?.paymentMethod?.number || '',
    expiration: user?.paymentMethod?.expiration || '',
    CVV: user?.paymentMethod?.CVV || '',
  });

//State for messages

  const [message, setMessage] = useState('');

  //State for delivery days

  const [deliveryDay, setDeliveryDay] = useState([]);

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
        address: formData.address,
        city: formData.city,
        region: formData.region,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      },

      user: formData.user,
      mealPlan: mealPlan._id,
      dishes: cart.map(item => item._id),
      deliveryDay,
      paymentMethod: {
        method: paymentData.method,
        number: paymentData.number,
        expiration: paymentData.expiration,
        CVV: paymentData.CVV,
      }
    };

    try {
      const response = await axios.post(MONGO_URI, subscriptionData);

      setMessage('Successfully saved address and payment method!');

      // reset the values once submitted

      setFormData({
        address: '',
        city: '',
        region: '',
        zipCode: '',
        country: '',
        phone: '',
        user: user ? user._id : null,
      });
      setPaymentData({
        method: '',
        number: '',
        expiration: '',
        CVV: '',
      });
      setDeliveryDay([]);

    } catch (error) {
      console.error('Error saving the address or payment method:', error);
      setMessage('Failed to save address or payment method.');
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
      <div>
        <p>Number of People: {mealPlan.numberOfPeople}</p>
        <p>Dishes per week: {mealPlan.dishesPerWeek}</p>
        <p>Diet: {mealPlan.diet}</p>
        <p>Price: {mealPlan.price}</p>
      </div>

      <h3>Your choices</h3>
      <div>
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <p>Name: {item.name}</p>
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
                <input type="text" name="address" value={formData.address} onChange={(e) => handleInputChange(e, setFormData, formData)} required />
              </label>
            </div>
            <div>
              <label>
                City:
                <input type="text" name="city" value={formData.city} onChange={(e) => handleInputChange(e, setFormData, formData)} required />
              </label>
            </div>
            <div>
              <label>
                Region:
                <input type="text" name="region" value={formData.region} onChange={(e) => handleInputChange(e, setFormData, formData)} required />
              </label>
            </div>
            <div>
              <label>
                Zip Code:
                <input type="text" name="zipCode" value={formData.zipCode} onChange={(e) => handleInputChange(e, setFormData, formData)} required />
              </label>
            </div>
            <div>
              <label>
                Country:
                <input type="text" name="country" value={formData.country} onChange={(e) => handleInputChange(e, setFormData, formData)} required />
              </label>
            </div>
            <div>
              <label>
                Phone:
                <input type="text" name="phone" value={formData.phone} onChange={(e) => handleInputChange(e, setFormData, formData)} required />
              </label>
            </div>

            <h4>Choose a delivery day</h4>
            <div>
              <select name="deliveryDay" value={deliveryDay} onChange={handleDeliveryDayChange} required>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <h4>Payment method</h4>
            <div>
              <label>
                Payment Method:
                <select name="method" value={paymentData.method} onChange={(e) => handleInputChange(e, setPaymentData, paymentData)} required>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Card Number:
                <input type="text" name="number" value={paymentData.number} onChange={(e) => handleInputChange(e, setPaymentData, paymentData)} required minLength="16" maxLength="16" />
              </label>
            </div>
            <div>
              <label>
                Expiration Date (MM/YY):
                <input type="text" name="expiration" value={paymentData.expiration} onChange={(e) => handleInputChange(e, setPaymentData, paymentData)} required minLength="5" maxLength="5" />
              </label>
            </div>
            <div>
              <label>
                CVV:
                <input type="text" name="CVV" value={paymentData.CVV} onChange={(e) => handleInputChange(e, setPaymentData, paymentData)} required minLength="3" maxLength="3" />
              </label>
            </div>

            <button type="submit">
              Submit
              <span></span><span></span><span></span><span></span>
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}

export default CheckOut;