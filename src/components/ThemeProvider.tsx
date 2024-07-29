import React , {ReactNode} from "react";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "../../styles/Theme.js"

interface NodeComponentProps {
  children: ReactNode;
}

const ThemeProviderComponent : React.FC<NodeComponentProps> = ({children}) => {
  return <ThemeProvider theme={Theme}>{children}</ThemeProvider>;
}

export default ThemeProviderComponent