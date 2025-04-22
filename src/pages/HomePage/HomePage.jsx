import "./HomePage.css";
import Hero from "../../components/Hero/Hero.jsx";
import { Link } from "react-router-dom";
import DishesCarrousel from "../../components/DishesCarrousel/DishesCarrousel";
import HowItWorksStepper from "../../components/HowItWorksStepper/HowItWorksStepper.jsx";

function HomePage() {
  return (
    <div className="HomePage-container">
      <Hero />
      <HowItWorksStepper/>      

      <section className="dishes-container">
        <h2>Dishes</h2>
        <DishesCarrousel />
        <Link to="/recipes">
          <button>
            {" "}
            Take a look at our meals!
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </Link>
      </section>

      <br />
    </div>
  );
}

export default HomePage;
