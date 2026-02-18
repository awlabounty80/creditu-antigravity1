import { cn } from '@/lib/utils';

interface CreditULogoProps {
    className?: string;
    iconClassName?: string;
    showShield?: boolean;
    variant?: 'gold' | 'navy' | 'white';
}

export function CreditULogo({
    className,
    iconClassName,
    showShield = true,
    variant = 'gold'
}: CreditULogoProps) {
    const colorMap = {
        gold: 'text-amber-500',
        navy: 'text-[#1a1f3a]',
        white: 'text-white'
    };

    const colorClass = colorMap[variant];

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <div className={cn("relative", colorClass)}>
                {/* Glow / Aura */}
                <div className="absolute inset-0 blur-3xl opacity-30 bg-indigo-500 rounded-full scale-150 pointer-events-none" />

                {/* Official Image Logo */}
                <div className={cn("relative z-10 p-1", iconClassName)}>
                    <img
                        src="/assets/official-logo.png"
                        alt="Credit U Official Logo"
                        className="w-full h-full object-contain rounded-full shadow-lg border-2 border-amber-500/20"
                    />
                </div>

                {/* Optional Shield Detail (Moved to Bottom) */}
                {showShield && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                        <div className="bg-inherit p-0.5 rounded-full filter drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M12 2L3 7V12C3 17.5 7 21 12 22C17 21 21 17.5 21 12V7L12 2Z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
