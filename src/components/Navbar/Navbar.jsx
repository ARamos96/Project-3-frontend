import "./Navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import ShoppingCart from ".././ShoppingCart/ShoppingCart";

function Navbar() {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider's `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const { deleteMealPlan, emptyCart } = useContext(CartContext);

  return (
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>

      <Link to="/recipes">
        <button>Our Meals</button>
      </Link>

      <Link to="/howitworks">
        <button>How It Works</button>
      </Link>

      <Link to="/mealplan">
        <button>Meal Plan</button>
      </Link>

      {isLoggedIn && (
        <>
          <button onClick={logOutUser(() => deleteMealPlan, () => emptyCart)}>
            Logout
          </button>

          <Link to="/profile">
            <button>Profile</button>
            {/* <img src="https://picsum.photos/id/402/200/300" style={{ width: 50, height: 50, borderRadius: 25}} alt="profile" /> */}
          </Link>

          <span>{user && user.name}</span>
          <ShoppingCart />
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/signup">
            {" "}
            <button className="SignUp">Sign Up</button>{" "}
          </Link>
          <Link to="/login">
            {" "}
            <button className="Login">Login</button>{" "}
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
