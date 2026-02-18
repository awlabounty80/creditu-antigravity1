import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { NODES } from './NodeRegistry';
import { RequireAuth } from '@/components/auth/RequireAuth';

export function NodeRoutes() {
    return (
        <>
            {/* All Nodes are rendered within the dashboard context but via their own routes */}
            {NODES.map(node => (
                <Route
                    key={node.id}
                    path={node.route.replace('/dashboard/', '').replace(/^\//, '')}
                    element={
                        <RequireAuth allowedRoles={node.permissions}>
                            <Suspense fallback={
                                <div className="h-screen flex flex-col items-center justify-center bg-[#020412]">
                                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                                    <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest animate-pulse">
                                        Initializing Node: {node.name}
                                    </div>
                                </div>
                            }>
                                <node.component />
                            </Suspense>
                        </RequireAuth>
                    }
                />
            ))}
        </>
    );
}

// Separate route for the Admin Switchboard to be added to AdminLayout
export function AdminNodeRoutes() {
    const NodeSwitchboard = React.lazy(() => import('@/pages/admin/NodeSwitchboard'));
    return (
        <Route
            path="switchboard"
            element={
                <RequireAuth allowedRoles={['admin', 'dean']}>
                    <Suspense fallback={null}>
                        <NodeSwitchboard />
                    </Suspense>
                </RequireAuth>
            }
        />
    );
}
