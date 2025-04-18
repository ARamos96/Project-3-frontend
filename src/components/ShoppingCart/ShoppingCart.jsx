import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DishInCart from "../DishInCart/DishInCart";
import { CartContext } from "../../context/cart.context";
import Sidebar from "../Sidebar/Sidebar";
import "./ShoppingCart.css";

function ShoppingCart() {
  const { badge, cart, getDishesAndQuantity, mealPlan, emptyCart } =
    useContext(CartContext);
  const [state, setState] = useState({ right: false });
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (badge > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [badge]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) return;

    setState({ ...state, [anchor]: open });
  };

  const renderCartList = () => {
    if (!cart || cart.length === 0) {
      return (
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            mt: 2,
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <ListItem>
            <ListItemText
              primary="Your cart is empty, please add dishes."
              primaryTypographyProps={{ sx: { fontSize: "1rem", textAlign: "center" } }}
            />
          </ListItem>
        </List>
      );
    }

    return (
      <>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {getDishesAndQuantity().map((dish) => (
            <DishInCart key={dish._id} dish={dish} />
          ))}
        </List>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <ListItem>
            <Link to="/checkout" style={{ textDecoration: "none" }}>
              <button className="checkoutButton" onClick={toggleDrawer("right", false)}>
                Checkout
                <span></span><span></span><span></span><span></span><span></span>
              </button>
            </Link>
          </ListItem>
          <ListItem>
            <button className="emptyCartButton" onClick={emptyCart}>
              Empty Cart
              <span></span><span></span><span></span><span></span><span></span>
            </button>
          </ListItem>
        </List>
      </>
    );
  };

  return (
    <Box
      sx={{
        color: "action.active",
        display: "flex",
        flexDirection: "column",
        "& > *": { marginBottom: 2 },
        "& .MuiBadge-root": { marginRight: 4 },
      }}
    >
      <div>
        <Badge
          color="secondary"
          badgeContent={badge}
          className={isBouncing ? "bounce" : ""}
        >
          <i
            className="pi pi-shopping-cart pi-large"
            onClick={toggleDrawer("right", true)}
            style={{ fontSize: "2rem", cursor: "pointer" }}
          ></i>
        </Badge>
      </div>

      <Sidebar
        anchor="right"
        isOpen={state.right}
        toggleDrawer={toggleDrawer}
      >
        {renderCartList()}
      </Sidebar>
    </Box>
  );
}

export default ShoppingCart;
