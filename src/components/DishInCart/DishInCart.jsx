import React, { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { CartContext } from "../../context/cart.context";

function DishInCart({ dish }) {
  const { addToCart, removeFromCart } = useContext(CartContext);

  return (
    <ListItem disablePadding sx={{ display: "flex", alignItems: "center" }}>
      <ListItemAvatar>
        <Avatar alt={dish.name} src={`${dish.name}.jpg`} />
      </ListItemAvatar>
      <ListItemText
        primary={dish.name}
        secondary={`Quantity: ${dish.count}`}
        primaryTypographyProps={{ display: "block" }}
        sx={{ marginLeft: 1, flexGrow: 1 }}
      />
      <div>
        <button className="cart-button"
          aria-label="reduce"
          onClick={() => {
            removeFromCart(dish);
          }}
          style={{ marginRight: "8px" }} 
        >
          <RemoveIcon fontSize="small" />
          <span></span><span></span><span></span><span></span><span></span>

        </button>
        <button className="cart-button"
          aria-label="increase"
          onClick={() => {
            addToCart(dish);
          }}
        >
          <AddIcon fontSize="small" />
          <span></span><span></span><span></span><span></span><span></span>
        </button>
      </div>
    </ListItem>
  );
}

export default DishInCart;
