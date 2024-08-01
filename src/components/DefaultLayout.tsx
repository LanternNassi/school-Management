"use client";

import "../app/globals.css";
// import { useState } from 'react'
import { useRouter } from "next/navigation";

import { ReactNode, useState } from "react";
import { Drawer } from "@mui/material";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import Link from "next/link";

import CircleNotificationsOutlinedIcon from "@mui/icons-material/CircleNotificationsOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddCardOutlinedIcon from "@mui/icons-material/AddCardOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import HailOutlinedIcon from "@mui/icons-material/HailOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";

import AppsIcon from "@mui/icons-material/Apps";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Alert } from "@mui/material";

import { styled } from "@mui/system";
import Image from "next/image";

import PropTypes from "prop-types";
import CustomSearch from "./CustomSearch";

import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";

interface Props {
  active_tab: string;
  // active_icon: ReactNode;
  children: ReactNode;
}

interface section {
  text: string;
  link: string;
  icon: ReactNode;
  admin: boolean | null;
}

const DefaultLayout: React.FC<Props> = ({ active_tab, children }) => {
  const [Open, setOpen] = useState<boolean>(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const router = useRouter();

  const Generalsections: section[] = [
    {
      text: "Dashboard",
      link: "/",
      icon: <DashboardCustomizeOutlinedIcon />,
      admin: false,
    },

    {
      text: "Users",
      link: "/users",
      icon: <AccountCircleOutlinedIcon />,
      admin: true,
    },
    {
      text: "Classes",
      link: "/classes",
      icon: <HailOutlinedIcon />,
      admin: false,
    },
    {
      text: "Streams",
      link: "/streams",
      icon: <HailOutlinedIcon />,
      admin: false,
    },
    {
      text: "Students",
      link: "/students",
      icon: <AddCardOutlinedIcon />,
      admin: false,
    },
  ];

  const TransactionsSection: section[] = [
    {
      text: "School Fees",
      link: "/",
      icon: <DashboardCustomizeOutlinedIcon />,
      admin: false,
    },

    {
      text: "Payments",
      link: "/users",
      icon: <AccountCircleOutlinedIcon />,
      admin: true,
    },
  ];

  const LayoutItem = (component: section): ReactNode => (
    <ListItem
      disabled={active_tab == component.text}
      key={component.text}
      disablePadding
    >
      <ListItemButton
        onClick={() => {
          router.push(component.link);
        }}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemIcon>{component.icon}</ListItemIcon>
        <ListItemText primary={component.text} />
      </ListItemButton>
    </ListItem>
  );

  const drawerList = (sections: section[]): ReactNode => (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {sections.map((component) => {
          // if (component.admin) {
          //   const role = JSON.parse(localStorage.getItem("User")).role;
          //   return role == "admin" ? LayoutItem(component) : null;
          // }
          return LayoutItem(component);
        })}
      </List>
    </Box>
  );

  const NavOpenDiv = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "7vw",
  }));

  const SectionHeader = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "20vw",
    height: "10vh",
    fontcolor: theme.palette.secondary.main,
  }));
  const HeaderDiv = styled("div")(() => ({
    height: "18vh",
    width: "86vw",
    position: "relative",
    top: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
  }));

  return (
    <div className="root">
      <div className="rootheader">
        <NavOpenDiv sx={{ width: "33vw" }}>
          {/* <Button
            onClick={toggleDrawer(true)}
            variant="outlined"
            sx = {{padding : 1}}
            startIcon={
              
            }
          >
            MENU
          </Button> */}

          <Image
            onClick={toggleDrawer(true)}
            src="/badge.jpg" // Path to your image
            alt="Example image"
            width={120} // Desired width
            height={120} // Desired height
          />

          <Typography variant="h5">BRIGHT GENERATION </Typography>
        </NavOpenDiv>

        <NavOpenDiv style={{ width: "58vw" }}>
          <CustomSearch
            placeholder={"Search Feature"}
            icon_1={<SearchIcon />}
            icon_2={<MenuIcon />}
            value={""}
            onChange={(e) => {}}
          />
          <AccountBalanceOutlinedIcon />
          <InboxIcon />
          <CircleNotificationsOutlinedIcon />
          <Button
            onClick={() => {}}
            variant="contained"
            startIcon={<AccountCircleOutlinedIcon />}
          >
            LOG OUT
          </Button>
        </NavOpenDiv>
      </div>

      <HeaderDiv>
        <Alert severity="success">Logged in as Nessim</Alert>

        <Divider style={{ width: "80vw" }} textAlign="right">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "14vw",
            }}
          >
            {/* {active_icon} */}
            <Typography variant="h5">{active_tab}</Typography>
          </div>
        </Divider>
      </HeaderDiv>

      <Drawer
        style={{
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
        open={Open}
        onClose={toggleDrawer(false)}
      >
        <div className="heading">
          <br />
          <Typography
            style={{ fontSize: "17px", fontWeight: "bold" }}
            variant="h5"
          >
            General Management
          </Typography>
        </div>
        <Divider />
        {drawerList(Generalsections)}

        <SectionHeader>
          <Typography
            style={{ fontSize: "17px", fontWeight: "bold" }}
            variant="h6"
          >
            Payments Management
          </Typography>
        </SectionHeader>
        <Divider />
        {drawerList(TransactionsSection)}
      </Drawer>

      {children}
    </div>
  );
};

export default DefaultLayout;

DefaultLayout.propTypes = {
  active_tab: PropTypes.string.isRequired,
};
