
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white p-10 font-mono">
                    <h1 className="text-red-500 text-2xl font-bold mb-4">CRITICAL SYSTEM FAILURE</h1>
                    <div className="p-4 border border-red-500/20 bg-red-900/10 rounded">
                        <p className="text-xl mb-2">{this.state.error?.message}</p>
                        <pre className="text-xs text-red-300 overflow-auto max-h-[500px]">
                            {this.state.error?.stack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-6 px-4 py-2 bg-white text-black font-bold hover:bg-slate-200"
                    >
                        EMERGENCY RESET (HOME)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
