import LiveOperatorDashboard from "@/components/operator/LiveOperatorDashboard";

export default function OperatorDashboardPage() {
  return (
    <>
      <header className="mb-8 max-md:mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle">
          Operations
        </p>
        <h1
          className="mt-2 text-ink font-light tracking-tight"
          style={{ fontSize: "36px", letterSpacing: "-1.0px" }}
        >
          Bangladesh dashboard
        </h1>
      </header>

      <LiveOperatorDashboard />
    </>
  );
}
