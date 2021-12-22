import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DecryptionAlgorithm } from "./utils";

const Decryptor = () => {
  const [message, setMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");

  const [value, setValue] = useState("string");

  const [cardHeight, setCardHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setCardHeight(ref.current ? ref.current.offsetHeight : 0);
    function handleResize() {
      setCardHeight(ref.current && ref.current.offsetHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const decryptData = () => {
    setDecryptedMessage(
      value === "string"
        ? DecryptionAlgorithm(message)
        : DecryptionAlgorithm(message)
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            height: cardHeight - 64,
            padding: "2rem",
            boxShadow: 4,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.01)",
            },
          }}
          ref={ref}
        >
          <Box sx={{ margin: "0 1rem", textAlign: "center" }}>
            <Typography variant='h5'>Decrypt Message</Typography>
          </Box>
          <Divider sx={{ margin: "2rem 0" }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              textAlign: "center",
            }}
          >
            <FormControl component='fieldset'>
              <FormLabel
                component='legend'
                sx={{ margin: "0rem 0rem 0rem 0.5rem " }}
              >
                Data to decrypt
              </FormLabel>
              <FormGroup aria-label='position' row>
                <FormControlLabel
                  value='string'
                  control={
                    <FormControlLabel
                      value='JSON'
                      control={<Switch color='primary' />}
                      label='JSON'
                      labelPlacement='end'
                      sx={{ margin: "0 0.5rem" }}
                    />
                  }
                  onChange={() => {
                    setValue(value === "string" ? "JSON" : "string");
                    setDecryptedMessage("");
                  }}
                  label='String'
                  labelPlacement='start'
                />
              </FormGroup>
            </FormControl>
          </Box>
          <Box sx={{ margin: "1rem" }}>
            <TextField
              variant='standard'
              label='Message'
              sx={{ width: "100%" }}
              onChange={(event) => setMessage(event.target.value)}
            />
          </Box>
          {/* add animation to button on click and ecrypted message display box */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant='contained'
              sx={{ margin: "1rem 0" }}
              onClick={decryptData}
            >
              Decrypt Data
            </Button>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card
          sx={{
            height: cardHeight - 64,
            padding: "2rem",
            boxShadow: 4,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.01)",
            },
          }}
        >
          <Box sx={{ margin: "0 1rem", textAlign: "center" }}>
            <Typography variant='h5'>Decrypted Message</Typography>
          </Box>
          <Box
            sx={{
              margin: "2rem auto",
              height: cardHeight - 160,
              backgroundColor: "#fff",
              border: "1.5px solid #777",
              borderRadius: "2px",
              padding: "1rem",
              textAlign: "justify",
            }}
          >
            <Typography
              variant='body1'
              sx={{
                maxHeight: "100%",
                overflowY: "auto",
                lineHeight: "1.5rem",
                letterSpacing: "0.06rem",
              }}
            >
              {decryptedMessage || "Decrypted Message will be displayed here"}
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Decryptor;
