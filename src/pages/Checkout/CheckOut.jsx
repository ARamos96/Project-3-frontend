import React, { useState, useContext, useEffect } from 'react';
import "./CheckOut.css";
import axios from 'axios';
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context.jsx";


function CheckOut() {

  // take user data from context

  const { user } = useContext(AuthContext);

  // take user data from cart context

  const { cart, mealPlan } = useContext(CartContext);
 
  const [formData, setFormData] = useState({
    address: user && user.address ? user.address : '',
    city: user && user.address ? user.address.city : '',
    region: user && user.address ? user.address.region : '',
    zipCode: user && user.address ? user.address.zipCode : '',
    country: user && user.address ? user.address.country : '',
    phone: user && user.address ? user.address.phone : '',
    user: user ? user._id : null,
    subscription: user && user.subscription ? user.subscription: '',
  });

  const [paymentData, setPaymentData] = useState({
    method: user && user.paymentMethod ? user.paymentMethod.method : '',
    number: user && user.paymentMethod ? user.paymentMethod.number : '',
    expiration: user && user.paymentMethod ? user.paymentMethod.expiration : '',
    CVV: user && user.paymentMethod ? user.paymentMethod.CVV : '',
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // post the address data
      const addressResponse = await axios.post('/address', formData);

      // post the payment data
      const paymentResponse = await axios.post('/payment', paymentData);

      // Clear the address and payment data

      setFormData({
        address: '',
        city: '',
        region: '',
        zipCode: '',
        country: '',
        phone: '',
        user: user ? user._id : null,
        subscription: '',
      });
      setPaymentData({
        method: '',
        number: '',
        expiration: '',
        CVV: '',
      });

    } catch (error) {
      console.error('Error saving the address or payment method:', error);
    }
  };

  if (!mealPlan) {
    return <h1> Get a mealplan first!!!</h1>
  }

  return (
    <div>
      <h2>Subscription summary</h2>

      <h3>Your meal plan</h3>
      <div>
        <p>Number of People: {mealPlan.numberOfPeople} </p>
        <p>Dishes per week: {mealPlan.dishesPerWeek} </p>
        <p>Diet: {mealPlan.diet} </p>
        <p>Price: {mealPlan.price} </p>
      
      </div>

      <h3>Your choices</h3>
      <div>
      {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <p>Name: {item.name}</p></div>
        ))}


      </div>

      <h3>Your details</h3>

      <div>

       {/* Form for the address  */} 

        <form onSubmit={handleSubmit}>
          <h4>Address</h4>

          <div>
            <label>
              Address:
              <input type="text" name="address" value={formData.address} onChange={handleAddressChange} required />
            </label>
          </div>
          <div>
            <label>
              City:
              <input type="text" name="city" value={formData.city} onChange={handleAddressChange} required />
            </label>
          </div>
          <div>
            <label>
              Region:
              <input type="text" name="region" value={formData.region} onChange={handleAddressChange} required />
            </label>
          </div>
          <div>
            <label>
              Zip Code:
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleAddressChange} required />
            </label>
          </div>
          <div>
            <label>
              Country:
              <input type="text" name="country" value={formData.country} onChange={handleAddressChange} required />
            </label>
          </div>
          <div>
            <label>
              Phone:
              <input type="text" name="phone" value={formData.phone} onChange={handleAddressChange} required />
            </label>
          </div>
        
          <h4>Payment method</h4>
          <div>
           
            {/* Form for the payment method  */} 

            <label>
              Payment Method:
              <select name="method" value={paymentData.method} onChange={handlePaymentChange} required>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Card Number:
              <input type="text" name="number" value={paymentData.number} onChange={handlePaymentChange} required minLength="16" maxLength="16" />
            </label>
          </div>
          <div>
            <label>
              Expiration Date (MM/YY):
              <input type="text" name="expiration" value={paymentData.expiration} onChange={handlePaymentChange} required minLength="5" maxLength="5" />
            </label>
          </div>
          <div>
            <label>
              CVV:
              <input type="text" name="CVV" value={paymentData.CVV} onChange={handlePaymentChange} required minLength="3" maxLength="3" />
            </label>
          </div>

          <button type="submit">Submit
          <span></span><span></span><span></span><span></span>

          </button>
        </form>
      </div>

      <button>Check out!
      <span></span><span></span><span></span><span></span>

      </button>
    </div>
  );
}

export default CheckOut;
