
import DefaultLayout from "@/components/DefaultLayout"


export default function ClassesLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <DefaultLayout active_tab="Classes">{children}</DefaultLayout>
  }