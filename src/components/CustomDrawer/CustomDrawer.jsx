import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";

export default function CustomDrawer({ anchor = "right", isOpen, toggleDrawer, width = 500, children }) {
  return (
    <SwipeableDrawer
      anchor={anchor}
      open={isOpen}
      onClose={toggleDrawer(anchor, false)}
      onOpen={toggleDrawer(anchor, true)}
      sx={{
        "& .MuiDrawer-paper": {
          bgcolor: "background.default",
          width: width,
          padding: "20px",
        },
      }}
    >
      <Box
        sx={{ width }}
        role="presentation"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
}
