import { ForecastBoard } from "@/components/forecast-board";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-semibold tracking-wide text-accent">TILT</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Nigeria 2027, state by state</h1>
        <p className="mt-3 max-w-2xl text-muted">
          A live forecast for the presidential and governorship elections, built only from public data:
          past results, prices, security, news and published polls. Projections, not results. Only INEC
          declares winners.
        </p>
      </header>
      <ForecastBoard />
    </main>
  );
}
