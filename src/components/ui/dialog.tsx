import React, { createContext, useContext, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const Dialog = ({
    children,
    open,
    onOpenChange
}: {
    children: React.ReactNode,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalOpen;
    const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

    return (
        <DialogContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </DialogContext.Provider>
    );
};

export const DialogTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
    const context = useContext(DialogContext);
    if (!context) throw new Error("DialogTrigger must be used within Dialog");

    // Simplification: Not handling asChild properly for now, just wrapping in span if not a single element
    // But for the button, we can just clone or wrap.
    return (
        <div onClick={() => context.setIsOpen(true)} className="inline-block cursor-pointer">
            {children}
        </div>
    );
};

export const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const context = useContext(DialogContext);
    if (!context) throw new Error("DialogContent must be used within Dialog");

    if (!context.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={() => context.setIsOpen(false)}
            />
            {/* Panel */}
            <div className={`relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200 ${className}`}>
                <button
                    onClick={() => context.setIsOpen(false)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>
    );
};

export const DialogHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
            {children}
        </div>
    );
};

export const DialogTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
            {children}
        </h2>
    );
};
