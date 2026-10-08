export default function WebsitesLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="h-10 w-64 rounded-md bg-gray-200"></div>
            <div className="mt-3 h-5 w-96 rounded-md bg-gray-200"></div>
          </div>
          <div className="h-12 w-40 rounded-lg bg-gray-200"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="h-48 w-full bg-gray-200"></div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="mt-auto h-4 w-full rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
