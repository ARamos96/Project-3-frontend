import React from "react";
import { Link } from "react-router-dom";
import "./ActivityCard.css";
import Loading from "../../Loading/Loading";
import { Accordion, AccordionTab } from "primereact/accordion";

import "../../../pages/HowItWorksPage/Accordion.css";

const NewActivityCard = ({ user }) => {
  if (
    !user?.activeSubscription &&
    !user?.previousSubscriptions?.length &&
    !user?.favDishes?.length
  ) {
    return null;
  }

  return (
    <div style={{ flex: "1 1 0%", minWidth: 300, padding: 10 }}>
      {user?.favDishes?.length > 0 && (
        <div className="profile-fav-dishes">
          <h2>Fav Dishes</h2>
          <div className="fav-dishes-container">
            {user.favDishes.map((dish, index) => (
              <div
                className="profile-item-container"
                key={index}
                style={{
                  backgroundImage: `url(/${encodeURIComponent(dish.name)}.jpg)`,
                }}
              >
                <Link to={`/recipes/${dish._id}`}>
                  <p>{dish.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      <h2>Subscriptions</h2>

      <div className="accordion">
        <Accordion activeIndex={1}>
          <AccordionTab header="Active Subscription">
            {user?.activeSubscription &&
              user.activeSubscription?.shippingAddress &&
              user.activeSubscription?.mealPlan && (
                <div className="active-subscription-container">
                  <div className="subscription-details-container">
                    <div className="mealplan-container">
                      <h5>Meal Plan:</h5>
                      <div className="mealplan-details">
                        {/* {user.activeSubscription.mealPlan.diet.join(", ")} for{" "} */}
                        <p>
                          {user.activeSubscription.mealPlan.numberOfPeople}{" "}
                          people
                        </p>
                        <p>
                          {user.activeSubscription.mealPlan.dishesPerWeek}{" "}
                          dishes/week
                        </p>
                      </div>
                    </div>
                    <h5>Dishes</h5>
                    <div className="subscription-dishes-container">
                      {user.activeSubscription.dishes.map((dish, index) => (
                        <div
                          key={index}
                          className="dish-thumbnail-mealplan"
                          style={{
                            backgroundImage: `url(/${encodeURIComponent(
                              dish.name
                            )}.jpg)`,
                          }}
                        >
                          <Link to={`/recipes/${dish._id}`}>
                            <p>{dish.name}</p>
                          </Link>
                          {/* - {dish.price}$ */}
                          {/* <div>
                      {dish.categories.origin.join(", ")},{" "}
                      {dish.categories.diet.join(", ")}, Cooking time:{" "}
                      {dish.cookingTime} minutes
                    </div> */}
                          {/* <div>
                      Nutritional Value:{" "}
                      {dish.nutritionalValuePerServing.calories} calories,{" "}
                      {dish.nutritionalValuePerServing.fat}g fat,{" "}
                      {dish.nutritionalValuePerServing.protein}g protein,{" "}
                      {dish.nutritionalValuePerServing.carbohydrates}g carbs,{" "}
                      {dish.nutritionalValuePerServing.fiber}g fiber
                    </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="delivery-details-container">
                    <div>
                      <h5>Delivery Day(s)</h5>
                      {user.activeSubscription.deliveryDay.join(", ")}
                    </div>
                    <div>
                      <h5>Shipping Address</h5>
                      {user.activeSubscription.shippingAddress.address},<br />
                      {user.activeSubscription.shippingAddress.zipCode},{" "}
                      {user.activeSubscription.shippingAddress.city},<br />
                      {user.activeSubscription.shippingAddress.region},{" "}
                      {user.activeSubscription.shippingAddress.country}
                    </div>
                    {/* <div>
              Payment Method: {user.activeSubscription.paymentMethod.method}{" "}
              ending in {user.activeSubscription.paymentMethod.number.slice(-4)}
              , Exp: {user.activeSubscription.paymentMethod.expiration}
            </div> */}
                  </div>
                </div>
              )}
          </AccordionTab>
        </Accordion>
      </div>

      {/* <h3>Previous Subscriptions:</h3>
      {user?.previousSubscriptions?.length > 0 && (
        <div className="profile-item">
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
              <div>Delivery Days: {subscription.deliveryDay.join(", ")}</div>
              <div>
                Payment Method: {subscription.paymentMethod.method} ending in{" "}
                {subscription.paymentMethod.number.slice(-4)}, Exp:{" "}
                {subscription.paymentMethod.expiration}
              </div>
              <div>
                Created At: {new Date(subscription.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )} */}

      <div className="accordion">
        <Accordion activeIndex={1}>
          <AccordionTab header="Previous Subscription(s)">
            {user?.previousSubscriptions?.length > 0 && (
              <div className="active-subscription-container">
                {user.previousSubscriptions.map((subscription, index) => (
                  <>
                    <div className="subscription-details-container">
                      <div className="mealplan-container">
                        <h5>Meal Plan:</h5>
                        <div className="mealplan-details">
                          <p>{subscription.mealPlan.numberOfPeople} people</p>
                          <p>
                            {subscription.mealPlan.dishesPerWeek} dishes/week
                          </p>
                        </div>
                      </div>
                      <h5>Dishes</h5>
                      <div className="subscription-dishes-container">
                        {subscription.dishes.map((dish, index) => (
                          <div
                            key={index}
                            className="dish-thumbnail-mealplan"
                            style={{
                              backgroundImage: `url(/${encodeURIComponent(
                                dish.name
                              )}.jpg)`,
                            }}
                          >
                            <Link to={`/recipes/${dish._id}`}>
                              <p>{dish.name}</p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="delivery-details-container">
                      <div>
                        <h5>Delivery Day(s)</h5>
                        {subscription.deliveryDay.join(", ")}
                      </div>
                      <div>
                        <h5>Shipping Address</h5>
                        {subscription.shippingAddress.address},<br />
                        {subscription.shippingAddress.zipCode},{" "}
                        {subscription.shippingAddress.city},<br />
                        {subscription.shippingAddress.region},{" "}
                        {subscription.shippingAddress.country}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            )}
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  );
};

export default NewActivityCard;
