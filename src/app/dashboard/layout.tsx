
import DefaultLayout from "@/components/DefaultLayout"


export default function DashBoardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <DefaultLayout active_tab="Dashboard">{children}</DefaultLayout>
  }