"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
export function AnalyticsChart({
  data,
}: {
  data: { day: string; requests: number; approved: number; rejected: number }[];
}) {
  return (
    <div className="card card-pad">
      <div className="section-heading">
        <div>
          <h2>Care at a glance</h2>
          <p className="text-[11px] muted mt-1">Request volume and outcomes · last 7 days</p>
        </div>
        <span className="text-[10px] muted border rounded-md px-2 py-1">This week</span>
      </div>
      <div
        className="h-[220px] w-full"
        role="img"
        aria-label={`Weekly requests: ${data.map((d) => `${d.day} ${d.requests}`).join(", ")}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#409c72" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#409c72" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              dy={8}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="requests"
              name="Requests"
              stroke="#328762"
              strokeWidth={2.5}
              fill="url(#chartFill)"
            />
            <Area
              type="monotone"
              dataKey="approved"
              name="Approved"
              stroke="#7b9b49"
              strokeDasharray="4 3"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="rejected"
              name="Rejected"
              stroke="#c15c52"
              strokeDasharray="3 4"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-5 text-[10px] muted justify-center mt-5">
        <span>● Requests</span>
        <span className="text-[#58772c] dark:text-[#bed795]">● Approved</span>
        <span className="text-[#a33830] dark:text-[#f5b0a8]">● Rejected</span>
      </div>
    </div>
  );
}
