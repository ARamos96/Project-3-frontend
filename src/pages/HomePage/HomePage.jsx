import "./HomePage.css";
//import "../HowitWorks/HowitWorks"
import { Link } from "react-router-dom";
import DishesCarrousel from "../../components/DishesCarrousel/DishesCarrousel";

function HomePage() {
  return (
    <div>
      <section>
        <h1>Savor Swift</h1>
      </section>

      <section>
        <h2>What is Savor Swift?</h2>
        <p>
          SavorSwift is a meal subscription service that provides
          nutritionist-designed recipes, allowing you to mix and match meals to
          fit your lifestyle. We deliver quality ingredients right to your
          doorstep, making healthy eating easy and convenient.
        </p>
      </section>

      <section>
        <h2>How it works?</h2>
        <div className="HowItWorksstepper">
          <div>
            <h5>Choose</h5>
            <p>
              <span>
                "Pick a diet preference, or mix and match tasty
                nutritionist-designed recipes to fit your lifestyle."
              </span>
            </p>
          </div>
          <div>
            <h5>Cook</h5>
            <p>
              <span>
                "Receive quality ingredients and easy-to-follow recipes, with
                most dinners ready in 30 minutes or less."
              </span>
            </p>
          </div>
          <div>
            <h5>Enjoy</h5>
            <p>
              <span>
                "You get the right portion size, carbs, protein, fats, and
                calories to align with your health goals."
              </span>
            </p>
          </div>
        </div>

        <Link to="/howitworks">
          <button> See more! </button>
        </Link>
      </section>

      <section>
        <h2>Dishes</h2>
        <DishesCarrousel />
        <Link to="/recipes">
          <button> Our Meals! </button>
        </Link>
      </section>

      <br />
    </div>
  );
}

export default HomePage;
