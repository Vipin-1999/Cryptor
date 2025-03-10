import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#ff5252", // Use red as primary color
      },
    },
    shape: {
      borderRadius: 20, // Every element gets a border radius of 20px
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          ::selection {
            background-color: #ff5252;
            color: #fff;
          }
        `,
      },
      MuiButton: {
        styleOverrides: {
          root: {
            height: 42,
            minWidth: 120,
            borderRadius: 16, // Matches the global shape border radius
          },
        },
      },
    },
  });

export default getTheme;
