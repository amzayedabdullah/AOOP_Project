import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ModeSwitcher from "@/components/dev/ModeSwitcher";

// Source of truth for these strings is `src/lib/operatorTheme.js`. They are
// duplicated here as inline literals because that module imports
// `useSyncExternalStore` (a client-only API) and therefore cannot be
// imported from this Server Component. Keep in sync if either changes.
const OPERATOR_THEME_KEY = "floodwatch.operatorTheme";
const OPERATOR_THEME_ROOT_ID = "operator-theme-root";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Inline pre-paint script. Lives in the root layout (a Server Component)
// so it renders into the SSR HTML and the browser executes it before first
// paint — no flash of the wrong theme. The body is a no-op on citizen
// routes since `#operator-theme-root` only exists inside the operator
// layout. Defaults to light when localStorage has no preference; only
// honors a stored "dark" value.
//
// React 19 warns when <script> tags are rendered inside Client Components
// (they don't execute on client renders). Putting the script here, in a
// Server Component, sidesteps that warning while keeping the pre-paint
// behavior on full page loads. Client-side navigations into the operator
// layout are handled by ThemeReflector's mount effect.
const OPERATOR_PRE_PAINT_SCRIPT = `
try {
  var root = document.getElementById("${OPERATOR_THEME_ROOT_ID}");
  if (root) {
    var t = window.localStorage.getItem("${OPERATOR_THEME_KEY}");
    var theme = (t === "dark") ? "dark" : "light";
    root.setAttribute("data-theme", theme);
  }
} catch (e) {
  var fallback = document.getElementById("${OPERATOR_THEME_ROOT_ID}");
  if (fallback) fallback.setAttribute("data-theme", "light");
}
`;

export const metadata = {
  title: "Smart Flood Prediction & Evacuation",
  description:
    "Frontend prototype of a flood-risk dashboard and evacuation planner for Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: OPERATOR_PRE_PAINT_SCRIPT }} />
        {children}
        <ModeSwitcher />
      </body>
    </html>
  );
}
