import DefaultLayout from "@/components/DefaultLayout";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

export default function TermLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DefaultLayout active_tab="Academic Terms">
        {children}
      </DefaultLayout>
    </>
  );
}
