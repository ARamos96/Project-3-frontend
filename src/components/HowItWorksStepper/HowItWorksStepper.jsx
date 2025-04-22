import { useState } from "react";
import "./HowItWorksStepper.scss";

const steps = [
  {
    title: "1. Choose",
    image: "/HIW-Step-1.jpg",
    heading: "Choose",
    description:
      "Pick a diet preference, or mix and match tasty nutritionist-designed recipes to fit your lifestyle.",
  },
  {
    title: "2. Cook",
    image: "/HIW-Step-2.jpg",
    heading: "Cook",
    description:
      "Receive quality ingredients and easy-to-follow recipes, with most dinners ready in 30 minutes or less.",
  },
  {
    title: "3. Enjoy",
    image: "/HIW-Step-3.jpg",
    heading: "Enjoy",
    description:
      "You get the right portion size, carbs, protein, fats and calories to eat in line with your health goals.",
  },
];

function HowItWorksStepper() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="howitworks-container">
      <h2>3 Swift Steps</h2>
      <div className="howitworks-stepper">
        {/* LEFT: TABS */}
        <div className="stepper-tabs">
          {steps.map((step, index) => (
            <button
              key={index}
              className={`tab-button ${activeStep === index ? "active" : ""}`}
              onClick={() => setActiveStep(index)}
            >
              {step.title[0]}
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </button>
          ))}
        </div>

        {/* MIDDLE COLUMN (duplicate buttons, but only show active) */}
        <div className="step-title-indicator">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`title-ghost ${activeStep === index ? "visible" : ""}`}
            >
              {step.heading}
            </div>
          ))}
        </div>

        {/* RIGHT: CONTENT */}
        <div className="step-content">
          <img
            className="step-thumbnail"
            src={steps[activeStep].image}
            alt={steps[activeStep].heading}
          />
          <div className="step-text">
            <p>{steps[activeStep].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksStepper;
