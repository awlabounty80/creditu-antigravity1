import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Search, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StatusPortal() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-white flex items-center gap-2">
                <ArrowLeft size={16} /> Back to Gate
            </Link>

            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                    <CardTitle>Check Application Status</CardTitle>
                    <CardDescription className="text-slate-400">Enter your email or application ID to resume.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input className="pl-9 bg-slate-950 border-slate-800 placeholder:text-slate-600" placeholder="Email or Application ID" />
                    </div>
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
                        Retrieve Record
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
