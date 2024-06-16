import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DishInCart from "../DishInCart/DishInCart";

import { CartContext } from "../../context/cart.context";
import "./ShoppingCart.css";

function ShoppingCart() {
  const { badge, cart, getDishesAndQuantity, mealPlan, emptyCart } =
    useContext(CartContext);
  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <>
      {cart && cart.length !== 0 ? (
        <>
          <List>
            {getDishesAndQuantity().map((dish) => (
              <DishInCart key={dish._id} dish={dish} />
            ))}
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText>TOTAL {mealPlan.price} euros</ListItemText>
            </ListItem>
            <Link to="/checkout" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Checkout
              </Button>
            </Link>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={emptyCart}
            >
              Empty Cart
            </Button>
          </List>
        </>
      ) : (
        <List>
          <ListItem>
            <ListItemText>Your cart is empty, please add dishes.</ListItemText>
          </ListItem>
        </List>
      )}
    </>
  );

  return (
    <Box
      sx={{
        color: "action.active",
        display: "flex",
        flexDirection: "column",
        "& > *": {
          marginBottom: 2,
        },
        "& .MuiBadge-root": {
          marginRight: 4,
        },
      }}
    >
      <div>
        <Badge color="secondary" badgeContent={badge}>
          <ShoppingCartIcon
            fontSize="large"
            className="icon"
            onClick={toggleDrawer("right", true)}
          />
        </Badge>
      </div>
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        <Box
          sx={{ width: 500 }}
          role="presentation"
          onClick={(event) => event.stopPropagation()} // Prevent click events from closing the drawer
        >
          {list("right")}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

export default ShoppingCart;
