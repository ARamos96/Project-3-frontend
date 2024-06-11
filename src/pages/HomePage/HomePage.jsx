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
          Savor Swift is an online meal delivery service dedicated to bringing a diverse array of freshly prepared, gourmet meals right to your doorstep. Our mission is to provide a convenient and high-quality dining experience by using locally-sourced, organic ingredients and catering to a wide range of dietary preferences and needs.
          At Savor Swift, we offer a variety of diets to suit every lifestyle, including vegan, vegetarian, gluten-free, keto, low-calories, paleo, and dairy-free options. We understand that maintaining a specific diet can be challenging, so we make it easy to enjoy delicious, nutritious meals that align with your dietary goals.
          Our menu spans a multitude of global cuisines, ensuring there's something for everyone. Indulge in the vibrant and healthful dishes of the Mediterranean, savor the rich and comforting flavors of Italian cuisine, experience the sophisticated and elegant tastes of French cooking, or explore the diverse and aromatic dishes from Asia, Mexico, and India. Whether you're in the mood for a Greek salad, spaghetti carbonara, coq au vin, teriyaki salmon, tacos, or butter chicken, Savor Swift has you covered.
          Savor Swift is designed to be user-friendly and convenient. Simply browse our extensive menu, place your order with your preferred customizations, and select your delivery time and location. Our expert chefs will meticulously prepare your meals, and our reliable delivery team will ensure they arrive at your door fresh and ready to enjoy.
          Join our community to receive exclusive offers, updates on new menu items, and cooking tips from our chefs. Follow us on social media to stay connected and share your Savor Swift experience with friends and family.
          Savor Swift – bringing the joy of delicious, home-cooked meals to your doorstep. Order today and taste the difference!
        </p>
      </section>

      <section>
        <h2>How it works?</h2>
        <p>Step 1</p>
        <p>Step 2</p>
        <p>Step 3</p>
        <Link to="/howitworks">
          <button> See more! </button>
        </Link>
      </section>

      <section>
        <h2>Dishes</h2>
        <p>
        <DishesCarrousel/>
        </p>
        <Link to="/recipes">
          <button> Our Meals! </button>
        </Link>
      </section>

      <br />





    </div>
  );
}

export default HomePage;
