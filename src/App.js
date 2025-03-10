import React, { useMemo, useState } from "react";
import { CssBaseline, Container, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import CryptoTool from "./components/CryptoTool";
import Footer from "./components/Footer";
import getTheme from "./theme";
import MarkdownRenderer from "./components/MarkdownRenderer";
import { introduction, toolsConfig } from "./utils/constants";

function App() {
  const [themeMode, setThemeMode] = useState("light");

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <MarkdownRenderer markdown={introduction} mode={theme} />
        </Box>
        {toolsConfig.map((config, index) => (
          <CryptoTool key={index} config={config} theme={theme} />
        ))}
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
