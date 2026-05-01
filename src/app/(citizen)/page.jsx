import LiveCitizenHome from "@/components/citizen/LiveCitizenHome";
import { districts } from "@/data/districts";

// Fixed for now — a real selector lands in a later change.
const CURRENT_DISTRICT_ID = "dhaka";

export default function CitizenHomePage() {
  const district = districts.find((d) => d.id === CURRENT_DISTRICT_ID);

  return (
    <>
      <header className="mb-8 max-md:mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.4px] text-muted">
          Your district
        </p>
        <h1
          className="mt-2 text-heading font-light tracking-tight"
          style={{ fontSize: "36px", letterSpacing: "-1.0px" }}
        >
          {district.name}
        </h1>
      </header>

      <LiveCitizenHome districtId={district.id} districtName={district.name} />
    </>
  );
}
