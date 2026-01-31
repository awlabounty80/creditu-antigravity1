import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Edit2, Check, X } from 'lucide-react'
import { useDeveloperMode } from '@/hooks/useDeveloperMode'

interface UserProfile {
    id: string
    email: string
    first_name: string
    last_name: string
    moo_points: number
}

const MOCK_USERS: UserProfile[] = [
    { id: '1', email: 'alice@example.com', first_name: 'Alice', last_name: 'Wonder', moo_points: 1250 },
    { id: '2', email: 'bob@builder.com', first_name: 'Bob', last_name: 'Builder', moo_points: 450 },
    { id: '3', email: 'charlie@chocolate.com', first_name: 'Charlie', last_name: 'Bucket', moo_points: 800 },
]

export default function UserManager() {
    const { isDevMode } = useDeveloperMode()
    const [users, setUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editPoints, setEditPoints] = useState<number>(0)

    useEffect(() => {
        fetchUsers()
    }, [isDevMode])

    const fetchUsers = async () => {
        setLoading(true)

        if (isDevMode) {
            setUsers(MOCK_USERS)
            setLoading(false)
            return
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) {
            console.error("Error fetching users:", error)
        }

        if (data) setUsers(data)
        setLoading(false)
    }

    const startEdit = (user: UserProfile) => {
        setEditingId(user.id)
        setEditPoints(user.moo_points || 0)
    }

    const saveEdit = async () => {
        if (!editingId) return

        // Optimistic update
        setUsers(users.map(u => u.id === editingId ? { ...u, moo_points: editPoints } : u))
        setEditingId(null)

        const { error } = await supabase
            .from('profiles')
            .update({ moo_points: editPoints })
            .eq('id', editingId)

        if (error) {
            console.error("Failed to update points:", error)
            // Revert logic would go here
            fetchUsers()
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Database (God Mode)</CardTitle>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search students..." className="pl-8 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    {loading && <div className="p-4 text-slate-500">Loading users...</div>}
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b [&_tr]:border-slate-800">
                            <tr className="border-b transition-colors hover:bg-slate-800/50 data-[state=selected]:bg-slate-800">
                                <th className="h-12 px-4 align-middle font-medium text-slate-400">Student</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Moo Points</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-800 transition-colors hover:bg-slate-800/20">
                                    <td className="p-4 align-middle font-medium">{user.first_name} {user.last_name}</td>
                                    <td className="p-4 align-middle text-slate-400">{user.email || 'No Email'}</td>
                                    <td className="p-4 align-middle text-right">
                                        {editingId === user.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Input
                                                    type="number"
                                                    value={editPoints}
                                                    onChange={(e) => setEditPoints(parseInt(e.target.value))}
                                                    className="w-24 h-8 bg-slate-950 border-slate-700 text-right"
                                                />
                                            </div>
                                        ) : (
                                            <span className="font-mono text-emerald-500">{user.moo_points}</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        {editingId === user.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/20" onClick={saveEdit}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-950/20" onClick={() => setEditingId(null)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="ghost" className="h-8 text-slate-400 hover:text-white" onClick={() => startEdit(user)}>
                                                    <Edit2 className="h-3 w-3 mr-2" /> Edit
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950/20" onClick={() => {
                                                    if (confirm(`View as ${user.first_name}?`)) {
                                                        sessionStorage.setItem('impersonate_id', user.id)
                                                        window.location.reload()
                                                    }
                                                }}>
                                                    Impersonate
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card >
    )
}
