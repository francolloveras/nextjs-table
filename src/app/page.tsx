import DemoTable from '@/components/demo-table'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { PageSearchParams } from '@/lib/type'

export default async function Home({ searchParams }: { searchParams: PageSearchParams }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-20 pt-12 pb-4">
      <Header />
      <div className="flex-1 max-w-3xl w-full">
        <DemoTable searchParams={searchParams} />
      </div>
      <Footer />
    </div>
  )
}
