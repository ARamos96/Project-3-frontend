import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MobileDrawerMenu({ menuItems, title = "SavorSwift", onClose }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <IconButton disableRipple onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton disableRipple
              onClick={() => {
                item.action();
                onClose();
              }}
            >
              <ListItemIcon>
                <i className={`pi ${item.icon}`} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
