export default function CitizenLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-citizen text-heading">
      <header className="sticky top-0 z-10 border-b border-hairline-citizen bg-canvas-citizen/80 backdrop-blur">
        <div className="mx-auto max-w-[1280px] px-6 max-md:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-tight text-heading">
              Floodwatch
            </span>
            <span className="text-muted text-sm max-md:hidden">
              Bangladesh
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-sm text-body hover:text-heading max-md:hidden"
            >
              Dhaka — Mirpur
            </button>
            <button
              type="button"
              className="bg-tide hover:bg-tide-hover text-white text-sm font-medium px-4 py-2 rounded-button"
            >
              Get alerts
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-[1280px] px-6 max-md:px-4 py-12 max-md:py-8">
        {children}
      </main>
    </div>
  );
}
