import React from "react";
import "./HowItWorksPage.css";
import { useNavigate } from "react-router-dom";
import AccordionComponent from "./Accordion";

function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="howitworks">
      <h1>How does SavourSwift Work?</h1>
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
      <button onClick={() => navigate("/recipes")}>Let's get STARTED!</button>
      <div className="FAQs">
        <h2>Frequently Asked Questions</h2>
        {/* <div className="FAQs-container">
          <h3>What is SavourSwift?</h3>
          <p>
            SavourSwift is a meal subscription service that provides
            nutritionist-designed recipes, allowing you to mix and match meals
            to fit your lifestyle. We deliver quality ingredients right to your
            doorstep, making healthy eating easy and convenient.
          </p>
        </div>

        <div className="FAQs-container">
          <h3>How does the subscription work?</h3>
          <p>
            When you subscribe to SavourSwift, you can choose a meal plan that
            fits your dietary preferences and schedule. Every week, you'll
            receive a box with fresh ingredients and step-by-step recipes to
            create delicious and nutritious meals at home.
          </p>
        </div>

        <div className="FAQs-container">
          <h3>Can I customize my meal plan?</h3>
          <p>
            Yes, you can customize your meal plan based on your dietary needs
            and preferences. Whether you are vegetarian, vegan, gluten-free, or
            have other specific requirements, SavourSwift offers a variety of
            options to ensure your meals are tailored to your lifestyle.
          </p>
        </div>

        <div className="FAQs-container">
          <h3>What if I have food allergies?</h3>
          <p>
            SavourSwift takes food allergies seriously. During the sign-up
            process, you can specify any allergies or dietary restrictions. Our
            team will ensure that your meals are prepared accordingly, providing
            you with safe and delicious options.
          </p>
        </div>

        <div className="FAQs-container">
          <h3>How flexible is SavourSwift? What am I committing to?</h3>
          <p>
            SavourSwift is a flexible weekly subscription with no minimum
            commitment and no cancellation fees. You can change your recipes,
            modify your delivery, or skip weeks without any obligation.
          </p>
        </div> */}
        
        <AccordionComponent
          question="What is SavourSwift?"
          answer="SavourSwift is a meal subscription service that provides
  nutritionist-designed recipes, allowing you to mix and match meals
  to fit your lifestyle. We deliver quality ingredients right to your
  doorstep, making healthy eating easy and convenient."
        />

        <AccordionComponent
          question="How does the subscription work?"
          answer="When you subscribe to SavourSwift, you can choose a meal plan that
  fits your dietary preferences and schedule. Every week, you'll
  receive a box with fresh ingredients and step-by-step recipes to
  create delicious and nutritious meals at home."
        />

        <AccordionComponent
          question="Can I customize my meal plan?"
          answer="Yes, you can customize your meal plan based on your dietary needs
  and preferences. Whether you are vegetarian, vegan, gluten-free, or
  have other specific requirements, SavourSwift offers a variety of
  options to ensure your meals are tailored to your lifestyle."
        />

        <AccordionComponent
          question="What if I have food allergies?"
          answer="SavourSwift takes food allergies seriously. During the sign-up
  process, you can specify any allergies or dietary restrictions. Our
  team will ensure that your meals are prepared accordingly, providing
  you with safe and delicious options."
        />
        <AccordionComponent
          question="How flexible is SavourSwift? What am I committing to?"
          answer="SavourSwift is a flexible weekly subscription with no minimum
            commitment and no cancellation fees. You can change your recipes,
            modify your delivery, or skip weeks without any obligation."
        />
      </div>
    </div>
  );
}

export default HowItWorksPage;
