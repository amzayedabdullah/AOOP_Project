"use client";

// District map on a real OpenStreetMap basemap. Zones, routes, shelters,
// and sensors are drawn as Leaflet layers in that order (zones at the
// bottom, sensors on top) so a sensor pin is always visible. Pan/zoom are
// disabled — the map fits the active district on mount and stays put.

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { zones as allZones } from "@/data/zones";
import { sensors as allSensors } from "@/data/sensors";
import { bboxFromPolygons } from "@/lib/projection";
import { getCssVar } from "@/lib/cssVar";
import MapLegend from "./MapLegend";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function rebuildRoutes(layer, routes) {
  layer.clearLayers();
  routes.forEach((route) => {
    if (!route.path || route.path.length < 2) return;
    L.polyline(route.path, {
      color: getCssVar(
        route.isSelected ? "--color-route-primary" : "--color-route-alternate",
      ),
      opacity: route.isSelected ? 1 : 0.4,
      weight: route.isSelected ? 3 : 1.5,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(layer);
  });
}

function shelterIconHtml(isSelected) {
  const fill = getCssVar("--color-marker-shelter");
  const ring = getCssVar("--color-tide");
  if (isSelected) {
    return `<svg width="22" height="22" viewBox="0 0 22 22"><polygon points="11,1 21,11 11,21 1,11" fill="${ring}" fill-opacity="0.4"/><polygon points="11,4 18,11 11,18 4,11" fill="${fill}"/></svg>`;
  }
  return `<svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 13,7 7,13 1,7" fill="${fill}"/></svg>`;
}

function rebuildShelters(layer, shelters) {
  layer.clearLayers();
  shelters.forEach(({ shelter, isSelected }) => {
    const size = isSelected ? 22 : 14;
    const icon = L.divIcon({
      className: "shelter-marker",
      html: shelterIconHtml(isSelected),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
    L.marker([shelter.lat, shelter.lng], { icon })
      .bindTooltip(
        `${shelter.name} · ${shelter.verified ? "verified" : "community"}`,
      )
      .addTo(layer);
  });
}

export default function RiskZoneMap({
  districtId,
  routes = [],
  shelters = [],
  header,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({ routes: null, shelters: null });
  const resetViewRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hasMoved, setHasMoved] = useState(false);

  const zones = allZones.filter((z) => z.districtId === districtId);
  const sensors = allSensors.filter((s) => s.districtId === districtId);
  const selected = zones.find((z) => z.id === selectedId);
  const selectedRoute = routes.find((r) => r.isSelected);

  // Mount the Leaflet map + tile + zone + sensor layers when districtId
  // changes. Routes/shelters are populated here too (from refs) so a
  // remount restores them.
  useEffect(() => {
    if (zones.length === 0) return;
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      zoomControl: true,
      attributionControl: true,
      dragging: true,
      // Wheel-over-map would steal page-scroll; the +/- buttons, double-
      // click, pinch, and keyboard cover the zoom intent.
      scrollWheelZoom: false,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      touchZoom: true,
      tap: true,
      minZoom: 7,
      maxZoom: 18,
    });
    mapRef.current = map;

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 18,
    }).addTo(map);

    const bbox = bboxFromPolygons(zones.map((z) => z.polygon));
    const districtBounds = [
      [bbox.minLat, bbox.minLng],
      [bbox.maxLat, bbox.maxLng],
    ];

    // Reset-view machinery: a programmatic fitBounds fires moveend and/or
    // zoomend; we don't want those to flip hasMoved=true. Suppress the next
    // 2 events (covers both) and clear residual suppression after 300ms in
    // case Leaflet skipped one when already-at-target.
    let suppressedEvents = 0;
    let suppressionTimer = null;

    function fitToDistrict() {
      setHasMoved(false);
      suppressedEvents = 2;
      if (suppressionTimer) clearTimeout(suppressionTimer);
      suppressionTimer = setTimeout(() => {
        suppressedEvents = 0;
        suppressionTimer = null;
      }, 300);
      map.fitBounds(districtBounds, { padding: [16, 16], maxZoom: 12 });
    }

    function onMoveOrZoomEnd() {
      if (suppressedEvents > 0) {
        suppressedEvents--;
        return;
      }
      setHasMoved(true);
    }

    map.on("moveend", onMoveOrZoomEnd);
    map.on("zoomend", onMoveOrZoomEnd);

    resetViewRef.current = fitToDistrict;
    fitToDistrict();

    // Layer order — bottom to top: zones → routes → shelters → sensors.
    const zonesLayer = L.layerGroup().addTo(map);
    const routesLayer = L.layerGroup().addTo(map);
    const sheltersLayer = L.layerGroup().addTo(map);
    const sensorsLayer = L.layerGroup().addTo(map);
    layersRef.current = { routes: routesLayer, shelters: sheltersLayer };

    zones.forEach((zone) => {
      const level = zone.level.toLowerCase();
      const polygon = L.polygon(zone.polygon, {
        fillColor: getCssVar(`--color-risk-${level}-fill`),
        color: getCssVar(`--color-risk-${level}-text`),
        fillOpacity: 0.6,
        weight: 1,
      }).addTo(zonesLayer);

      polygon.on("mouseover", () => setSelectedId(zone.id));
      polygon.on("mouseout", () => setSelectedId(null));
      polygon.on("click", () => setSelectedId(zone.id));

      // Path element isn't always attached the moment addTo returns; defer
      // a frame so getElement() can resolve.
      requestAnimationFrame(() => {
        const el = polygon.getElement();
        if (!el) return;
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", `${zone.name} — ${zone.level}`);
        el.style.cursor = "pointer";
        el.addEventListener("focus", () => setSelectedId(zone.id));
        el.addEventListener("blur", () => setSelectedId(null));
        el.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedId(zone.id);
          }
        });
      });
    });

    sensors.forEach((sensor) => {
      L.circleMarker([sensor.lat, sensor.lng], {
        radius: 6,
        fillColor: getCssVar("--color-marker-sensor"),
        color: getCssVar("--color-surface-citizen"),
        weight: 2,
        fillOpacity: 1,
      })
        .bindTooltip(`${sensor.id} · ${sensor.riverName}`)
        .addTo(sensorsLayer);
    });

    // routes/shelters are intentionally read from the current render's
    // closure (not a ref) so a districtId change rebuilds with the latest
    // overlays. They are NOT in the deps array because the dedicated
    // effects below handle subsequent updates without tearing down the map.
    rebuildRoutes(routesLayer, routes);
    rebuildShelters(sheltersLayer, shelters);

    return () => {
      if (suppressionTimer) clearTimeout(suppressionTimer);
      map.remove();
      mapRef.current = null;
      layersRef.current = { routes: null, shelters: null };
      resetViewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  useEffect(() => {
    const layer = layersRef.current.routes;
    if (!layer) return;
    rebuildRoutes(layer, routes);
  }, [routes]);

  useEffect(() => {
    const layer = layersRef.current.shelters;
    if (!layer) return;
    rebuildShelters(layer, shelters);
  }, [shelters]);

  if (zones.length === 0) {
    return (
      <div className="bg-surface-citizen border border-hairline-citizen rounded-card p-6 text-body">
        No zone data for this district.
      </div>
    );
  }

  return (
    <div className="bg-surface-citizen border border-hairline-citizen rounded-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4 max-md:flex-col max-md:items-start">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.4px] text-muted">
            District map
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-heading">
            Risk zones
          </h2>
          <p className="mt-1 text-xs text-muted">
            OpenStreetMap basemap — pan and zoom disabled.
          </p>
          {header ? <div className="mt-4">{header}</div> : null}
        </div>
        <MapLegend />
      </div>

      <div className="mt-6 relative">
        <div
          ref={containerRef}
          className="rounded-lg overflow-hidden border border-hairline-citizen aspect-[3/2] w-full bg-surface-mist"
          role="img"
          aria-label={`Risk zones for ${districtId}`}
        />
        {hasMoved ? (
          <button
            type="button"
            onClick={() => resetViewRef.current?.()}
            className="absolute top-2 right-2 z-10 bg-surface-citizen border border-hairline-citizen rounded-button text-xs px-2 py-1 text-body shadow-card hover:bg-surface-mist"
          >
            Reset view
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-body" aria-live="polite">
        {selected ? (
          <>
            <span className="font-semibold text-heading">{selected.name}</span>
            <span className="text-muted"> — {selected.level}</span>
          </>
        ) : (
          <span className="text-muted">
            Hover or focus a zone to see details.
          </span>
        )}
        {selectedRoute ? (
          <span className="text-muted">
            {" · Showing: "}
            {selectedRoute.variant}
            {" · cost ≈ "}
            <span className="tnum">{Math.round(selectedRoute.cost)}</span>
          </span>
        ) : null}
      </p>
    </div>
  );
}
