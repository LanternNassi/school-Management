import React from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

export interface FeedBackProps {
  open: boolean;
  message: string;
  outlined: boolean;
  status: "error" | "warning" | "info" | "success";
}

export const FeedBack: React.FC<FeedBackProps> = ({ open, message, outlined, status }) => {
  return (
    <Box
      sx={{
        width: "30%",
        position: "sticky",
        top: "2vh",
        zIndex: 1,
      }}
    >
      <Collapse in={open}>
        <Alert
          variant={outlined ? "outlined" : "filled"}
          severity={status}
          action={
            <IconButton aria-label="close" color="inherit" size="small">
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

