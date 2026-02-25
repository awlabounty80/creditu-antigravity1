import React, { useState } from 'react';
import { useProfessor } from './ProfessorContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Mic, X, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfessorChat = ({ onClose }: { onClose: () => void }) => {
    const { triggerGuidance } = useProfessor();
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkPII = (text: string): boolean => {
        // Simple regex patterns for sensitive data (Guardrails Rule #2)
        const ssnPattern = /\d{3}-?\d{2}-?\d{4}/;
        const dobPattern = /\d{1,2}\/\d{1,2}\/\d{2,4}/;
        const addressPattern = /\d+\s+[A-Za-z]+\s+(St|Street|Ave|Avenue|Rd|Road|Blvd)/i;

        if (ssnPattern.test(text) || dobPattern.test(text) || addressPattern.test(text)) {
            return true;
        }
        return false;
    };

    const handleSend = () => {
        if (!query.trim()) return;

        // PII GUARDRAIL CHECK
        if (checkPII(query)) {
            setError("For your privacy, please DO NOT enter sensitive info (SSN, DOB, Address) into this chat. Use the official letter forms which are session-protected.");
            return;
        }

        setError(null);

        // Simulate AI Response (In real app, this would hit an API)
        const lowerQ = query.toLowerCase();
        let response = "That's a great question. In general, consistency is key.";
        let emotion = 'neutral';

        if (lowerQ.includes('when') || lowerQ.includes('time')) {
            response = "Dispute rounds typically take 30-45 days. Mark your calendar and wait for the mail.";
            emotion = 'neutral';
        } else if (lowerQ.includes('score') || lowerQ.includes('points')) {
            response = "Your score updates when new data hits your report. Focus on removing negatives and lowering utilization.";
            emotion = 'happy';
        } else {
            response = "I can guide you on strategy, but remember I cannot give legal advice. Check the Knowledge Center for specific laws.";
            emotion = 'thinking';
        }

        // Trigger the Overlay to speak the response
        triggerGuidance({
            id: `chat-response-${Date.now()}`,
            text: response,
            emotion: emotion as any,
            duration: 8000
        });

        setQuery('');
        onClose(); // Close chat to show overlay speaking
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden z-[60]"
        >
            {/* Header */}
            <div className="bg-[#0a0f2c] p-4 flex justify-between items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
                <h3 className="font-bold text-sm flex items-center gap-2 relative z-10">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Professor Intelligence
                </h3>
                <button onClick={onClose} className="hover:text-amber-400 transition-colors relative z-10">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="p-5 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Ask me about dispute strategy, timing, or credit basics.
                    <br />
                    <span className="text-amber-700 font-bold flex items-center gap-1 mt-1">
                        <ShieldAlert className="w-3 h-3" /> Note: Do not enter PII here.
                    </span>
                </p>

                <div className="flex gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your question..."
                        className="text-sm bg-white"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setIsListening(!isListening)}
                        className={isListening ? 'text-red-500 border-red-200 bg-red-50' : ''}
                    >
                        <Mic className="h-4 w-4" />
                    </Button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[10px] text-red-600 bg-red-50 p-2 rounded border border-red-100 font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <Button onClick={handleSend} className="w-full bg-[#0a0f2c] hover:bg-blue-900 text-white text-sm shadow-lg shadow-blue-900/10">
                    <Send className="h-3 w-3 mr-2" /> Submit Question
                </Button>
            </div>
        </motion.div>
    );
};
