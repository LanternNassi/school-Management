
import DefaultLayout from "@/components/DefaultLayout"


export default function StreamsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <DefaultLayout active_tab="Streams">{children}</DefaultLayout>
  }