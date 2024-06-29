import React from "react";

const ActivityCard = ({ user }) =>
  (user.activeSubscription || user.favDishes || user.previousSubscriptions) && (
<div style={{ flex: "1 1 0%", minWidth: 300, padding: 10 }}>
      <h2>Activity</h2>
      {user.activeSubscription && (
        <div className="profile-item">
          <strong>Active Subscription:</strong>
          <div>
            Shipping Address: {user.activeSubscription.shippingAddress.address},{" "}
            {user.activeSubscription.shippingAddress.city},{" "}
            {user.activeSubscription.shippingAddress.region},{" "}
            {user.activeSubscription.shippingAddress.zipCode},{" "}
            {user.activeSubscription.shippingAddress.country},{" "}
            {user.activeSubscription.shippingAddress.phone}
          </div>
          <div>
            Meal Plan: {user.activeSubscription.mealPlan.diet.join(", ")} for{" "}
            {user.activeSubscription.mealPlan.numberOfPeople} people,{" "}
            {user.activeSubscription.mealPlan.dishesPerWeek} dishes/week, $
            {user.activeSubscription.mealPlan.price}
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
                    {dish.nutritionalValuePerServing.carbohydrates}g carbs,{" "}
                    {dish.nutritionalValuePerServing.fiber}g fiber
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            Delivery Days: {user.activeSubscription.deliveryDay.join(", ")}
          </div>
          <div>
            Payment Method: {user.activeSubscription.paymentMethod.method}{" "}
            ending in {user.activeSubscription.paymentMethod.number.slice(-4)},
            Exp: {user.activeSubscription.paymentMethod.expiration}
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
                  Nutritional Value: {dish.nutritionalValuePerServing.calories}{" "}
                  calories, {dish.nutritionalValuePerServing.fat}g fat,{" "}
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
      )}
    </div>
  );

export default ActivityCard;
