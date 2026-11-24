import DemoTable from '@/components/demo-table'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { PageSearchParams } from '@/lib/type'

export default async function Home({ searchParams }: { searchParams: PageSearchParams }) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-y-10 px-4 pt-10 pb-5 sm:px-6 lg:gap-y-12 lg:px-8">
      <Header />
      <main className="w-full max-w-6xl flex-1">
        <DemoTable searchParams={searchParams} />
      </main>
      <Footer />
    </div>
  )
}
