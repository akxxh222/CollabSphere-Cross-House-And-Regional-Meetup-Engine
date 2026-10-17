export default function StudentDashboardLoading() {
  return (
    <div className="p-6" aria-label="Loading student dashboard" aria-busy="true">
      <div className="skeleton h-8 w-64 mb-4" />
      <div className="skeleton h-4 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-4 w-24 mb-3" />
            <div className="skeleton h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
