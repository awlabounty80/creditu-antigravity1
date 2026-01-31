import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Construction } from 'lucide-react'

export default function ToolPlaceholder({ title }: { title: string }) {
    const navigate = useNavigate()

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
                <Construction className="w-10 h-10 text-indigo-400" />
            </div>

            <h1 className="text-4xl font-heading font-bold text-white mb-4">{title}</h1>
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-lg">
                This Neural Engine is currently being compiled by the Credit U engineering team.
                Access will be granted in the next system update.
            </p>

            <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 gap-2"
                onClick={() => navigate('/dashboard/credit-lab')}
            >
                <ArrowLeft size={16} /> Return to Lab
            </Button>
        </div>
    )
}
