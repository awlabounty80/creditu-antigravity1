import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';

const COLORS = [
    'text-indigo-500',
    'text-amber-500',
    'text-pink-500',
    'text-blue-500',
    'text-purple-500',
    'text-emerald-500'
];

export function FloatingCreditCards() {
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        const newCards = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 40 + 20,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * 360
        }));
        setCards(newCards);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1] opacity-20">
            {cards.map((card) => (
                <motion.div
                    key={card.id}
                    initial={{
                        opacity: 0,
                        x: `${card.x}vw`,
                        y: `${card.y}vh`,
                        rotate: card.rotation
                    }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        x: [`${card.x}vw`, `${card.x + (Math.random() * 10 - 5)}vw`],
                        y: [`${card.y}vh`, `${card.y + (Math.random() * 10 - 5)}vh`],
                        rotate: card.rotation + 360
                    }}
                    transition={{
                        duration: card.duration,
                        repeat: Infinity,
                        delay: card.delay,
                        ease: "linear"
                    }}
                    className={`absolute ${card.color}`}
                    style={{ filter: 'blur(1px)' }}
                >
                    <CreditCard size={card.size} strokeWidth={1} />
                </motion.div>
            ))}
        </div>
    );
}
