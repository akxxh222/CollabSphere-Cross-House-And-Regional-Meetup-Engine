export default function AdminDashboardLoading() {
  return (
    <div className="p-6" aria-label="Loading admin dashboard" aria-busy="true">
      <div className="skeleton h-8 w-56 mb-4" />
      <div className="skeleton h-4 w-40 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-4 w-20 mb-3" />
            <div className="skeleton h-10 w-16" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="skeleton h-64 w-full" />
      </div>
    </div>
  );
}
