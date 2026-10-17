"use client";
import { useState } from "react";
import { MapPin, Users, CalendarDays } from "lucide-react";
type Marker = {
  id: string;
  title: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  startsAt?: string;
  attendees: number;
  kind?: "event" | "peer";
};
export function RegionalMap({ events }: { events: Marker[] }) {
  const [active, setActive] = useState(events[0]?.id);
  const selected = events.find((event) => event.id === active);
  return (
    <div className="map-shell" aria-label="Interactive regional meetup map">
      <div className="map-grid" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(134,215,170,.22),transparent_36%)]" />
      {events.map((event) => {
        const left = Math.max(8, Math.min(90, ((event.longitude + 180) / 360) * 100));
        const top = Math.max(10, Math.min(84, ((90 - event.latitude) / 180) * 100));
        return (
          <button
            key={event.id}
            onClick={() => setActive(event.id)}
            className={`map-marker ${active === event.id ? "active" : ""}`}
            style={{ left: `${left}%`, top: `${top}%` }}
            aria-label={`${event.kind === "peer" ? "House peer" : "Meetup"}: ${event.title} in ${event.city}`}
          >
            <MapPin size={18} />
          </button>
        );
      })}
      <div className="map-label">INDIA REGIONAL NETWORK</div>
      {selected && (
        <div className="map-card">
          <p className="eyebrow">
            {selected.kind === "peer" ? "Nearby house peer" : selected.region}
          </p>
          <h3 className="mt-1">{selected.title}</h3>
          <p className="muted text-xs mt-2 flex gap-2 items-center">
            <MapPin size={13} />
            {selected.city}
          </p>
          <div className="flex gap-4 text-[11px] mt-3">
            {selected.startsAt && (
              <span className="flex gap-1 items-center">
                <CalendarDays size={13} />
                {new Date(selected.startsAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
            <span className="flex gap-1 items-center">
              <Users size={13} />
              {selected.kind === "peer" ? "IIT Madras learner" : `${selected.attendees} going`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
