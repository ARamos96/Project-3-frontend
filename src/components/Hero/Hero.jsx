import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.scss";
import HeroCarousel from "../HeroCarousel/HeroCarousel";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__image">
        <HeroCarousel />
      </div>
      <div className="hero__content">
        <h1>Fresh meals for every lifestyle</h1>
        <p>No commitments. No cancellation fees. Just flavor.</p>
        <div className="hero__buttons">
          <button
            className="btn btn--primary"
            onClick={() => navigate("/mealplan")}
          >
            Get Started <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/recipes")}
          >
            Browse Dishes <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
