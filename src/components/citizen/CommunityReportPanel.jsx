"use client";

import CommunityReportForm from "./CommunityReportForm";
import CommunityReportFeed from "./CommunityReportFeed";

export default function CommunityReportPanel({ currentDistrictId }) {
  return (
    <div className="bg-surface-citizen border border-hairline-citizen rounded-card p-6 shadow-card">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.4px] text-muted">
          Community
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-heading">
          What’s happening on the ground
        </h2>
      </header>

      <div className="grid grid-cols-12 gap-6 max-md:grid-cols-1">
        <div className="col-span-5 max-md:col-span-1">
          <CommunityReportForm currentDistrictId={currentDistrictId} />
        </div>
        <div className="col-span-7 max-md:col-span-1">
          <CommunityReportFeed currentDistrictId={currentDistrictId} />
        </div>
      </div>
    </div>
  );
}
