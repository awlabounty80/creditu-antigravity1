import { CheckCircle2 } from 'lucide-react'

export function HeaderSyncStatus() {
    return (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
            <CheckCircle2 size={12} />
            <span>System Synced</span>
        </div>
    )
}
