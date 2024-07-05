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
                  </div>
                </div>
              )}
          </AccordionTab>
        </Accordion>
      </div>

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
