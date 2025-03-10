import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = ({ themeMode, toggleTheme }) => {
  return (
    <AppBar position="sticky" sx={{ mb: 3 }}>
      <Toolbar>
        <Box
          component="img"
          src="/cryptor-1.png" 
          alt="logo"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NextGenCryptor
        </Typography>
        <IconButton color="inherit" onClick={toggleTheme}>
          {themeMode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
