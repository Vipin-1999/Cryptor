import React, { useState } from "react";
import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Button,
  ButtonGroup,
  Menu,
  Typography,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import MarkdownRenderer from "./MarkdownRenderer";

const CryptoTool = ({ config, theme }) => {
  const { mode, inputTitle, outputTitle, actionLabel, description } = config;

  const [message, setMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [dataType, setDataType] = useState("string");
  const [prevDataType, setPrevDataType] = useState("string");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogNewType, setDialogNewType] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (option) => {
    setPrevDataType(dataType);
    setDataType(option);
    setAnchorEl(null);
    setResultMessage("");
  };

  const callApi = () => {
    setLoading(true);
    let endpoint = mode === "encrypt" ? "/encrypt" : "/decrypt",
      payload;
    if (mode === "encrypt") {
      payload = {
        plaintext:
          typeof message === "string"
            ? message
            : JSON.stringify(JSON.parse(message)),
      };
    } else if (mode === "decrypt") {
      payload = { cipher: message };
    }
    axiosInstance
      .post(endpoint, payload)
      .then((res) => {
        const data = res.data;
        setResultMessage(
          mode === "encrypt" || (mode === "decrypt" && typeof data === "string")
            ? data
            : JSON.stringify(data)
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const processData = () => {
    if (mode === "encrypt") {
      if (dataType === "JSON") {
        try {
          JSON.parse(message);
        } catch (err) {
          setDialogNewType("string");
          setDialogMessage(
            "Your input is not valid JSON, but you've selected JSON. We will proceed with String data type. Confirm to continue or Cancel to revert."
          );
          setDialogOpen(true);
          return;
        }
      } else if (dataType === "string") {
        try {
          JSON.parse(message);
          setDialogNewType("JSON");
          setDialogMessage(
            "Your input appears to be valid JSON, but you've selected String. We will proceed with JSON data type. Confirm to continue or Cancel to revert."
          );
          setDialogOpen(true);
          return;
        } catch (err) {
          console.log({ err });
        }
      }
    }
    callApi();
  };

  const handleDialogConfirm = () => {
    setDialogOpen(false);
    setDataType(dialogNewType);
    callApi();
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setDataType(prevDataType);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <Card
        sx={{
          padding: "2rem",
          boxShadow: 4,
          mb: 3,
          borderRadius: "20px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MarkdownRenderer markdown={description} mode={theme} />
            <Box sx={{ borderBottom: "1px solid #ccc", mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={inputTitle}
              placeholder="Enter your message here..."
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
                gap: 1,
              }}
            >
              {mode === "encrypt" ? (
                <ButtonGroup
                  variant={message !== "" ? "contained" : "outlined"}
                  disabled={loading || message === ""}
                  sx={{ borderRadius: "20px" }}
                >
                  <Button
                    onClick={processData}
                    sx={{ borderRadius: "20px", width: "180px" }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        {actionLabel}&nbsp;{dataType}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleMenuClick}
                    sx={{
                      minWidth: "auto",
                      padding: "0 8px",
                      borderRadius: "20px",
                      width: "24px",
                    }}
                  >
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>
              ) : (
                <Button
                  variant={message !== "" ? "contained" : "outlined"}
                  disabled={loading || message === ""}
                  onClick={processData}
                  sx={{ borderRadius: "20px", width: "180px" }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    actionLabel
                  )}
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={outputTitle}
              placeholder="Response will be displayed here..."
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={resultMessage}
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            {resultMessage && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  variant={copied ? "text" : "outlined"}
                  disabled={copied}
                  onClick={handleCopy}
                  sx={{ borderRadius: "20px" }}
                >
                  {copied ? (
                    <>
                      <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Copied
                    </>
                  ) : (
                    <>
                      <ContentCopyIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Copy
                    </>
                  )}
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Card>

      {mode === "encrypt" && (
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { borderRadius: "20px", width: "220px" },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => handleMenuSelect("string")}>String</MenuItem>
          <MenuItem onClick={() => handleMenuSelect("JSON")}>JSON</MenuItem>
        </Menu>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>Confirm Data Type Correction</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Cancel</Button>
          <Button onClick={handleDialogConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CryptoTool;
