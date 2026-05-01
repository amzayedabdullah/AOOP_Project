"use client";

// Single client boundary for the operator dashboard. Owns the only useTick
// instance on the operator side; threads `tick` and `offsets` into every
// live consumer. The chart panel deliberately does NOT receive `offsets` —
// sliders affect "now", the chart shows the last 24 hours of recorded data.

import { useState } from "react";
import useTick from "@/lib/useTick";
import { sensors } from "@/data/sensors";
import { DEFAULT_OFFSETS } from "@/lib/simulation";
import OperatorOverviewMap from "./OperatorOverviewMap";
import OperatorDistrictList from "./OperatorDistrictList";
import SimulationPanel from "./SimulationPanel";
import SensorTable from "./SensorTable";
import PredictedVsActualChart from "./PredictedVsActualChart";
import AlertComposerPanel from "./AlertComposerPanel";

export default function LiveOperatorDashboard() {
  const { tick } = useTick(5000);
  const [focusedDistrictId, setFocusedDistrictId] = useState(null);
  const [selectedSensorId, setSelectedSensorId] = useState(sensors[0]?.id);
  const [offsets, setOffsets] = useState(DEFAULT_OFFSETS);

  return (
    <section className="grid grid-cols-12 gap-6 max-md:grid-cols-1 max-md:gap-4">
      <div className="col-span-8 max-md:col-span-1">
        <OperatorOverviewMap
          tick={tick}
          offsets={offsets}
          focusedDistrictId={focusedDistrictId}
          onFocusDistrict={(id) =>
            setFocusedDistrictId((prev) => (prev === id ? null : id))
          }
        />
      </div>
      <div className="col-span-4 max-md:col-span-1">
        <OperatorDistrictList
          tick={tick}
          offsets={offsets}
          focusedDistrictId={focusedDistrictId}
          onFocusDistrict={setFocusedDistrictId}
        />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <SimulationPanel offsets={offsets} onChange={setOffsets} />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <SensorTable
          tick={tick}
          offsets={offsets}
          focusedDistrictId={focusedDistrictId}
          selectedSensorId={selectedSensorId}
          onSelectSensor={setSelectedSensorId}
        />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <PredictedVsActualChart selectedSensorId={selectedSensorId} />
      </div>
      <div className="col-span-12 max-md:col-span-1">
        <AlertComposerPanel focusedDistrictId={focusedDistrictId} />
      </div>
    </section>
  );
}
