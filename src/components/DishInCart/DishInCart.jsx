import React, { useContext } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CartContext } from "../../context/cart.context";

function DishInCart({ dish }) {
  const { addToCart, removeFromCart } = useContext(CartContext);

  return (
    <div>
      <ListItem key={dish._id} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <img src={dish.smallImageURL} alt={dish.name} width="50" height="50" />
            {dish.count}
          </ListItemIcon>
          <ListItemText primary={`${dish.name}`} />
          <ButtonGroup>
            <Button
              aria-label="reduce"
              onClick={() => {
                removeFromCart(dish);
              }}
            >
              <RemoveIcon fontSize="small" />
            </Button>
            <Button
              aria-label="increase"
              onClick={() => {
                addToCart(dish);
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        </ListItemButton>
      </ListItem>
    </div>
  );
}

export default DishInCart;

/*  


const [count, setCount] = React.useState(1);
  const [invisible, setInvisible] = React.useState(false);

  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
  };
BUTTONS TO DECREASE AND DECREASE
        <ButtonGroup>
          <Button
            aria-label="reduce"
            onClick={() => {
              setCount(Math.max(count - 1, 0));
            }}
          >
            <RemoveIcon fontSize="small" />
          </Button>
          <Button
            aria-label="increase"
            onClick={() => {
              setCount(count + 1);
            }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </ButtonGroup>
*/
