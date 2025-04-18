import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { CartContext } from "../../context/cart.context";
import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import MobileDrawerMenu from "./MobileDrawerMenu";

import "./Navbar.scss";
import CustomDrawer from "../CustomDrawer/CustomDrawer";

export default function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const { setMealPlan, setCart } = useContext(CartContext);
  const [drawerState, setDrawerState] = useState({ left: false });

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
      style: { marginLeft: "auto" }, // ← pushes this one to the right
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
            logOutUser(setMealPlan, setCart);
          },
          template: itemRenderer,
        },
      ],
    },
  ].filter(Boolean);

  const start = (
    <img
      alt="logo"
      src="/SavorSwift.jpg"
      height="40"
      className="mr-2"
      onClick={() => navigate("/")}
    />
  );

  const end = (
    <div className="navbar-end">
      {isLoggedIn && <ShoppingCart />}
      {!isLoggedIn && (
        <>
          <Link to="/signup">
            <button className="log-in-button">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="log-in-button">Log In</button>
          </Link>
        </>
      )}
    </div>
  );

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;

    setDrawerState({ ...drawerState, [anchor]: open });
  };

  const mobileMenuItems = [
    { label: "Home", icon: "pi-home", action: () => navigate("/") },
    {
      label: "Our Dishes",
      icon: "pi pi-book",
      action: () => navigate("/recipes"),
    },
    {
      label: "How It Works",
      icon: "pi pi-question",
      action: () => navigate("/howitworks"),
    },
    {
      label: "Meal Plan",
      icon: "pi pi-calculator",
      action: () => navigate("/mealplan"),
    },
  ];

  return (
    <div className="navbar-container">
      <CustomDrawer
        anchor="left"
        isOpen={drawerState.left}
        toggleDrawer={toggleDrawer}
        width={260}
        disableEnforceFocus={true}
      >
        <MobileDrawerMenu
          menuItems={mobileMenuItems}
          onClose={toggleDrawer("left", false)}
        />
      </CustomDrawer>

      {/* Desktop navbar */}
      <div className="navbar-desktop">
        <Menubar model={items} start={start} end={end} />
      </div>

      {/* Mobile navbar */}
      <div className="navbar-mobile">
        <i className="pi pi-bars" onClick={toggleDrawer("left", true)} />

        <img
          src="/SavorSwift.jpg"
          alt="logo"
          height="40"
          className="navbar-logo"
          onClick={() => navigate("/")}
        />
        <div>
          <i
            className="pi pi-user"
            onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
          />
          {isLoggedIn && <ShoppingCart />}
        </div>
      </div>
    </div>
  );
}
