import { AppBar, Box, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Decryptor from "./Decryptor";
import Encryptor from "./Encryptor";
import { useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Box>
      <Box sx={{ textAlign: "center", margin: "4rem", color: "#fff" }}>
        <Typography variant='h3'>Welcome to Cryptor!</Typography>
      </Box>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <AppBar position='static'>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{ backgroundColor: "#000" }}
            TabIndicatorProps={{ style: { background: "red" } }}
            textColor='inherit'
            variant='fullWidth'
            aria-label='full width tabs example'
            centered
          >
            <Tab label='Encryptor' {...a11yProps(0)} />
            <Tab label='Decryptor' {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
          <TabPanel value={value} index={0}>
            <Encryptor />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Decryptor />
          </TabPanel>
        </SwipeableViews>
      </Box>
    </Box>
  );
}

export default App;
