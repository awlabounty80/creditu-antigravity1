import type { PageId } from "./amara-knowledge-maps";

export function detectPageId(pathname: string): PageId {
    const p = (pathname || "/").toLowerCase();

    // Home / Dashboard (specific check for dashboard root)
    // Home / Dashboard (strict check for root)
    if (p === "/" || p === "/dashboard" || p === "/dashboard/") return "home_dashboard";

    // Credit Lab
    if (p.includes("/credit-lab") || p.includes("/lab")) return "credit_lab";

    // Credit Tools
    if (p.includes("/tools") || p.includes("/simulator") || p.includes("/quest")) // Quest fits here?
        return "credit_tools";

    // Courses / Lessons
    if (p.includes("/curriculum") || p.includes("/courses") || p.includes("/lessons"))
        return "courses_lessons";

    // Membership / Levels (Vision might go here or tools?)
    // Vision Center logic
    if (p.includes("/vision")) return "unknown"; // Or map to tools? Let's keep unknown as per map/fallback

    // Vending Machine
    if (p.includes("/store") || p.includes("/vending") || p.includes("/rewards"))
        return "vending_machine";

    // Profile / Settings
    if (p.includes("/settings") || p.includes("/profile") || p.includes("/account"))
        return "profile_settings";

    // Safe fallback (Dashboard)
    if (p.includes("/dashboard")) return "home_dashboard";

    return "unknown";
}
