import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import "./Navbar.css"; // Import your custom CSS file for Navbar styling

export default function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const { deleteMealPlan, emptyCart } = useContext(CartContext);

  const navigate = useNavigate();

  const itemRenderer = (item) => (
    <a className="p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Our Dishes",
      icon: "pi pi-book",
      command: () => navigate("/recipes"),
    },
    {
      label: "How It Works",
      icon: "pi pi-question",
      command: () => navigate("/howitworks"),
    },
    {
      label: "Meal Plan",
      icon: "pi pi-calculator",
      command: () => navigate("/mealplan"),
    },
    isLoggedIn && {
      label: "My Account",
      icon: "pi pi-user",
      items: [
        {
          label: "Profile",
          icon: "pi pi-user-edit",
          command: () => navigate("/profile"),
          template: itemRenderer,
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => {
            logOutUser(deleteMealPlan, emptyCart);
          },
          template: itemRenderer,
        },
      ],
    },
  ].filter(Boolean); // Filter out any false values

  const start = (
    <img
      alt="logo"
      src="/SavourSwift.jpg"
      height="40"
      className="mr-2"
      onClick={() => navigate("/")}
    />
  );

  const end = (
    <div className="flex items-center gap-2 ml-auto w-300px">
      {isLoggedIn ? (
        <>
          <Avatar
            image="https://static-00.iconduck.com/assets.00/user-avatar-icon-2048x2048-wpp8os2d.png" // Adjust the path to your avatar image
            shape="circle"
          />
          <ShoppingCart />
        </>
      ) : (
        <>
          <Link to="/signup">
            <button className="log-in-button">Sign In</button>
          </Link>
          <Link to="/login">
            <button className="log-in-button">
              Log In
            </button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <div className="navbar-container">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
