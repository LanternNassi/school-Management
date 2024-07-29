'use client';

import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      // main: '#590925',
      main : '#105D5E'
    },
    secondary: {
      main: '##D4DCFF',
    },
    background: {
      paper : "#E9EAEE",
      default : "#E9EAEE"
    },
    action: {
      active: "#105D5E",

      focus: "#105D5E",

      selected: "#105D5E",

    }
  },
  typography: {
    fontFamily: 'Figtree, sans-serif',
    fontSize: 15,
  },

});

export default Theme;