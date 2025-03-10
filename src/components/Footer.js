import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ p: 2, mt: 4, textAlign: "center", borderTop: "1px solid #ccc" }}>
      <Typography variant="body2" color="text.secondary">
        Built with React, Material-UI and Firebase.
      </Typography>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        © 2025 NextGenCryptor.
      </Typography>
    </Box>
  );
};

export default Footer;
