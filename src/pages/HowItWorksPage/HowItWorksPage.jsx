import React from "react";
import "./HowItWorksPage.css";
import { useNavigate } from "react-router-dom";
import AccordionComponent from "./Accordion";

function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="howitworks">
      <h1>How does SavorSwift Work?</h1>
      <div className="steps">
        <div className="step-container">
          <img className="step-thumbnail" src="/HIW-Step-1.jpg" alt="Step-1" />
          <h2>Choose</h2>
          <p>
            Pick a diet preference, or mix and match tasty nutritionist-designed
            recipes to fit your lifestyle
          </p>
        </div>
        <div className="step-container">
          <img className="step-thumbnail" src="/HIW-Step-2.jpg" alt="Step-2" />
          <h2>Cook</h2>
          <p>
            Receive quality ingredients and easy-to-follow recipes, with most
            dinners ready in 30 minutes or less
          </p>
        </div>
        <div className="step-container">
          <img className="step-thumbnail" src="/HIW-Step-3.jpg" alt="Step-3" />
          <h2>Enjoy</h2>
          <p>
            You get the right portion size, carbs, protein, fats and calories to
            eat in line with your health goals
          </p>
        </div>
      </div>
      <button onClick={() => navigate("/recipes")}>Let's get STARTED!
      <span></span><span></span><span></span><span></span>

      </button>
      <div className="FAQs">
        <h2>Frequently Asked Questions</h2>

        <AccordionComponent
          question="What is SavorSwift?"
          answer="Savor Swift is an online meal delivery service dedicated to bringing a diverse array of freshly prepared, gourmet meals right to your doorstep. Our mission is to provide a convenient and high-quality dining experience by using locally-sourced, organic ingredients and catering to a wide range of dietary preferences and needs.
          At Savor Swift, we offer a variety of diets to suit every lifestyle, including vegan, vegetarian, gluten-free, keto, low-calories, paleo, and dairy-free options. We understand that maintaining a specific diet can be challenging, so we make it easy to enjoy delicious, nutritious meals that align with your dietary goals.
          Our menu spans a multitude of global cuisines, ensuring there's something for everyone. Indulge in the vibrant and healthful dishes of the Mediterranean, savor the rich and comforting flavors of Italian cuisine, experience the sophisticated and elegant tastes of French cooking, or explore the diverse and aromatic dishes from Asia, Mexico, and India. Whether you're in the mood for a Greek salad, spaghetti carbonara, coq au vin, teriyaki salmon, tacos, or butter chicken, Savor Swift has you covered.
          Savor Swift is designed to be user-friendly and convenient. Simply browse our extensive menu, place your order with your preferred customizations, and select your delivery time and location. Our expert chefs will meticulously prepare your meals, and our reliable delivery team will ensure they arrive at your door fresh and ready to enjoy.
          Join our community to receive exclusive offers, updates on new menu items, and cooking tips from our chefs. Follow us on social media to stay connected and share your Savor Swift experience with friends and family.
          Savor Swift – bringing the joy of delicious, home-cooked meals to your doorstep. Order today and taste the difference!"
        />

        <AccordionComponent
          question="How does the subscription work?"
          answer="When you subscribe to SavorSwift, you can choose a meal plan that
  fits your dietary preferences and schedule. Every week, you'll
  receive a box with fresh ingredients and step-by-step recipes to
  create delicious and nutritious meals at home."
        />

        <AccordionComponent
          question="Can I customize my meal plan?"
          answer="Yes, you can customize your meal plan based on your dietary needs
  and preferences. Whether you are vegetarian, vegan, gluten-free, or
  have other specific requirements, SavorSwift offers a variety of
  options to ensure your meals are tailored to your lifestyle."
        />

        <AccordionComponent
          question="What if I have food allergies?"
          answer="SavorSwift takes food allergies seriously. During the sign-up
  process, you can specify any allergies or dietary restrictions. Our
  team will ensure that your meals are prepared accordingly, providing
  you with safe and delicious options."
        />
        <AccordionComponent
          question="How flexible is SavorSwift? What am I committing to?"
          answer="SavorSwift is a flexible weekly subscription with no minimum
            commitment and no cancellation fees. You can change your recipes,
            modify your delivery, or skip weeks without any obligation."
        />
      </div>
    </div>
  );
}

export default HowItWorksPage;
