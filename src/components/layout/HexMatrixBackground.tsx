import { useEffect, useRef } from 'react';

export function HexMatrixBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const hexSize = 30; // Radius of hexagon
        const hexHeight = hexSize * 2;
        const hexWidth = Math.sqrt(3) * hexSize;
        const vertDist = hexHeight * 0.75;

        // Pulse state
        const pulses: { r: number, c: number, life: number }[] = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const drawHex = (x: number, y: number, color: string, fill = false) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i + Math.PI / 6;
                const hx = x + hexSize * Math.cos(angle);
                const hy = y + hexSize * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();

            if (fill) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw underlying grid - Brightened
            ctx.lineWidth = 1;

            const rows = Math.ceil(height / vertDist) + 2;
            const cols = Math.ceil(width / hexWidth) + 2;

            for (let r = -1; r < rows; r++) {
                for (let c = -1; c < cols; c++) {
                    const xOffset = (r % 2) * (hexWidth / 2);
                    const x = c * hexWidth + xOffset;
                    const y = r * vertDist;

                    // Grid lines - Increased visibility
                    drawHex(x, y, 'rgba(99, 102, 241, 0.1)');
                }
            }

            // Update pulses - Increased Frequency
            if (Math.random() < 0.2) {
                pulses.push({
                    r: Math.floor(Math.random() * rows),
                    c: Math.floor(Math.random() * cols),
                    life: 1.0
                });
            }

            // Draw pulses
            for (let i = pulses.length - 1; i >= 0; i--) {
                const p = pulses[i];
                p.life -= 0.02; // Fade speed

                if (p.life <= 0) {
                    pulses.splice(i, 1);
                    continue;
                }

                const xOffset = (p.r % 2) * (hexWidth / 2);
                const x = p.c * hexWidth + xOffset;
                const y = p.r * vertDist;

                const opacity = p.life * 0.4; // Max opacity
                drawHex(x, y, `rgba(99, 102, 241, ${opacity})`, true);
                drawHex(x, y, `rgba(167, 139, 250, ${opacity + 0.2})`); // Outline
            }

            requestAnimationFrame(render);
        };

        const animationId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] bg-[#050B1C] pointer-events-none"
        />
    );
}
