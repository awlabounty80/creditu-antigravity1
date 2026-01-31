
import { Button } from "@/components/ui/button"

export default function DebugDashboard() {
    return (
        <div className="p-20 bg-red-900 text-white min-h-screen">
            <h1 className="text-6xl font-black">DEBUG MODE ACTIVE</h1>
            <p className="text-2xl mt-4">If you see this, the code updates are REACHING the browser.</p>
            <p className="mt-8">Original Dashboard is hidden to test connection.</p>
            <Button className="mt-8 bg-white text-red-900">Test Button</Button>
        </div>
    )
}
