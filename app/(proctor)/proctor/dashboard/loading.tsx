export default function ProctorDashboardLoading() {
  return (
    <div className="p-6" aria-label="Loading proctor dashboard" aria-busy="true">
      <div className="skeleton h-8 w-56 mb-4" />
      <div className="skeleton h-4 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-4 w-24 mb-3" />
            <div className="skeleton h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="skeleton h-48 w-full" />
      </div>
    </div>
  );
}
