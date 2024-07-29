import Drawer from "@mui/material/Drawer";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import React, { ReactNode } from "react";

interface Props {
    open:boolean;
    Heading:string;
    Fields:()=>ReactNode;
    toggleDrawer:(e : boolean)=>void;
    onSubmit:(e: React.FormEvent<HTMLFormElement>)=>void
}

export default function Edit({
  open,
  Heading,
  Fields,
  toggleDrawer,
  onSubmit,
} : Props) {
  return (
    <Drawer
      disableAutoFocus
      anchor={"right"}
      open={open}
      onClose={() => {
        toggleDrawer(false);
      }}
    >
      <div
        style={{
          width: "30vw",
          height: "14vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Typography
          style={{ fontSize: "17px", fontWeight: "bold" }}
          variant="h6"
        >
          {Heading}
        </Typography>
        <Divider style={{ width: "28vw" }} />
      </div>
      <Box
        onSubmit={(event) => {
          onSubmit(event);
        }}
        component="form"
        noValidate
        autoComplete="off"
        style={{
          width: "30vw",
          minHeight: "40vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          flexGrow: 1,
          maxHeight: "300vh",
          overflowY: "scroll",
          gap: "16px",
          paddingBottom: "16px",
        }}
      >
        {Fields()}
      </Box>
    </Drawer>
  );
}

Edit.propTypes = {
  open: PropTypes.string.isRequired,
  Fields: PropTypes.node.isRequired,
  Heading: PropTypes.string.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
