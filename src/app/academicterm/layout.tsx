
import DefaultLayout from "@/components/DefaultLayout"


export default function TermLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <DefaultLayout active_tab="Academic Terms">{children}</DefaultLayout>
  }