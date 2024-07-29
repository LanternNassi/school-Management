
import DefaultLayout from "@/components/DefaultLayout"


export default function StudentsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <DefaultLayout active_tab="Students">{children}</DefaultLayout>
  }