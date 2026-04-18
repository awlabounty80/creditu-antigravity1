// STUDENT LOCKER - THE VAULT OF ADMISSIONS REWARDS
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Lock,
    Sparkles,
    Gift,
    Search,
    Filter,
    Download,
    FileText,
    ShieldCheck,
    Zap,
    ExternalLink,
    ChevronRight,
    Trophy,
    GraduationCap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDormWeek, Reward } from '@/hooks/useDormWeek';
// @ts-ignore - html2pdf provided via npm
import html2pdf from 'html2pdf.js';
import confetti from 'canvas-confetti';

const LOCAL_REWARD_POOL: Reward[] = [
    // --- ALPHA INTEL ROTATION POOL (Slot 1 Spin) ---
    { id: 'INTEL-01', type: 'tip', title: 'The Statement Date Snipe', content: 'Sniper Precision: Pay before your statement date to "ghost" the bureaus.', icon: 'ShieldCheck' },
    { id: 'INTEL-02', type: 'tip', title: 'The LexisNexis Ghost Protocol', content: 'Stealth Mode: Freeze secondary bureaus so big banks can\'t see your old "Red Zone" data.', icon: 'ShieldCheck' },
    { id: 'INTEL-03', type: 'tip', title: 'The 2% Sweet Spot', content: 'Financial Flex: 0% utilization looks "dead". Keep 2% to show the algorithm you’re alive.', icon: 'ShieldCheck' },
    { id: 'INTEL-04', type: 'tip', title: 'The Address Scrub Logic', content: 'Clean Slate: A single misspelled address on your report can cause an automatic dispute rejection.', icon: 'ShieldCheck' },
    { id: 'INTEL-05', type: 'tip', title: 'The "No-Fly" Inquiry Limit', content: 'Border Control: More than 2 inquiries in 6 months triggers "Automatic Denial" for top-tier cards.', icon: 'ShieldCheck' },
    { id: 'INTEL-06', type: 'tip', title: 'The Bureau Sync Secret', content: 'Total Synergy: Disputing with TransUnion first often triggers a "domino effect" across Equifax and Experian.', icon: 'ShieldCheck' },
    { id: 'INTEL-07', type: 'tip', title: 'The Age Accelerator', content: 'Time Travel: Use a family member\'s oldest card to "inject" 20 years of history into a 1-year-old file.', icon: 'ShieldCheck' },
    { id: 'INTEL-08', type: 'tip', title: 'The Credit Mix Multiplier', content: 'Variety Pack: The "3-Card Rule" - 3 revolving accounts and 1 installment loan to hit the 800-score ceiling.', icon: 'ShieldCheck' },
    { id: 'INTEL-09', type: 'tip', title: 'The Hard Pull Buffer', content: 'Safety First: Wait 91 days between applications to reset the bank\'s internal "Risk Clock."', icon: 'ShieldCheck' },
    { id: 'INTEL-10', type: 'tip', title: 'The Moo Point Multiplier', content: 'Viral Growth: Rapidly multiply massive stacks of wealth and bypass wait times.', icon: 'ShieldCheck' },

    // --- ANTIGRAVITY ROTATION POOLS (Center Spin) ---
    { id: 'FND-01', type: 'resource', title: 'The 24-Hour Inquiry Blitz', content: 'Pure Adrenaline: The "Rapid-Scrub" script to remove hard inquiries over the phone in minutes.', icon: 'ClipboardCheck' },
    { id: 'FND-02', type: 'resource', title: 'The Legacy ID Ledger', content: 'Biometric Security: A "Clean Sweep" form to wipe old addresses/names that confuse AI scanners.', icon: 'ClipboardCheck' },
    { id: 'FND-03', type: 'resource', title: 'The Subscription Audit Log', content: 'Cash Finder: Kills $50–$100 in unused apps to fund your first credit-builder account.', icon: 'ClipboardCheck' },

    { id: 'OFF-01', type: 'resource', title: 'The Dispute Playbook', content: 'Game-Day Intensity: Pre-identifies "Red Zone" items and generates exact legal challenge language.', icon: 'ClipboardCheck' },
    { id: 'OFF-02', type: 'resource', title: 'The CLI "Power-Up" Script', content: 'Buying Power: Word-for-word script to double credit limits without a hard credit pull.', icon: 'ClipboardCheck' },
    { id: 'OFF-03', type: 'resource', title: 'The "Goodwill" Letter', content: 'The Hail Mary: A high-success template for removing late payments for an instant 30-50 point jump.', icon: 'ClipboardCheck' },

    { id: 'ALP-01', type: 'resource', title: 'The AU "Piggyback" Agreement', content: 'The Velocity Tool: Contract to link a "Thin File" student to a mentor’s 10-year seasoned account.', icon: 'ClipboardCheck' },
    { id: 'ALP-02', type: 'resource', title: 'The 800 Score Syllabus', content: 'The Roadmap: The master checklist to move from "fixing" credit to mastering the entire system.', icon: 'ClipboardCheck' },
    { id: 'ALP-03', type: 'resource', title: 'The Alpha Utilization Shield', content: 'Total Protection: Automated calculator that hides spending from bureaus by timing payments.', icon: 'ClipboardCheck' },

    // Legacy Fallbacks & Mandatory Wins
    { id: 'ACC-01', type: 'acceptance', title: 'Official Admission', content: 'You are officially accepted to Credit University. Welcome to the Campus.', icon: 'GraduationCap' },
    { id: 'RES-01', type: 'resource', title: 'Credit Report Review Checklist', content: 'The official Credit U checklist for auditing your bureau files for Metro 2 errors.', icon: 'ClipboardCheck', download_url: '/credit-audit-checklist.pdf' },
    { id: 'RES-02', type: 'resource', title: 'Strategic Dispute Planner', content: 'Map your 90-day dispute sequence and track bureau responses with surgical precision.', icon: 'Map', download_url: '/resources/dispute-planner.pdf' },
    { id: 'RES-03', type: 'resource', title: 'Metro 2 Compliance Guide', content: 'Master the technical data standards bureaus use to report information and find factual errors.', icon: 'FileText', download_url: '/resources/metro2-guide.pdf' },
    { id: 'RES-04', type: 'resource', title: 'Debt Validation Master Class', content: 'The step-by-step framework for forcing collectors to prove they have the legal right to collect.', icon: 'ShieldCheck', download_url: '/resources/debt-validation.pdf' }
];

const DEEP_WISDOM_DETAILS: Record<string, string> = {
    'INTEL-01': "The Statement Date Snipe: Your credit score is heavily dictated by utilization, but bureaus only see what is reported on your 'Statement Closing Date', NOT your 'Due Date'. If you wait until your Due Date to pay, the high balance has already been reported to Equifax, Experian, and TransUnion. By paying your balance down to 2% three days BEFORE the Statement Closing Date, you artificially manufacture a near-zero utilization rate, triggering massive, immediate score jumps month-over-month.",
    'INTEL-02': "The LexisNexis Ghost Protocol: Major bureaus don't go to the courthouse to verify bankruptcies, tax liens, or judgments. They buy this data wholesale from secondary reporting agencies like LexisNexis, CoreLogic, and SageStream. By federally freezing these secondary bureaus BEFORE you dispute public records with the Big Three, you literally cut off their internet connection to the courthouse. When they try to verify, the system returns nothing, forcing a legal deletion.",
    'INTEL-03': "The 2% Sweet Spot: A $0 balance is not optimal. If your cards report $0, the algorithm assumes you aren't using credit at all, which stalls your velocity. Leaving exactly 2% (e.g., $20 on a $1,000 limit) shows the FICO scoring algorithm that you are actively using credit but managing it with extreme discipline. This triggers the maximum possible 'Active Management' bonus in the FICO 8 model.",
    'INTEL-04': "The Address Scrub Logic: Under the Fair Credit Reporting Act (FCRA), credit bureaus use automated software called e-OSCAR to verify disputes. This software matches the address tied to a negative account with the addresses on your profile. If you have 15 old addresses on your report, it acts as a permanent anchor for old debt. By deleting all prior addresses and leaving only your current residence, you sever the primary data link collectors use to verify negative accounts.",
    'INTEL-05': "The \"No-Fly\" Inquiry Limit: The algorithm considers credit-seeking behavior highly risky. Having more than 2 hard inquiries in a 6-month window places you in the 'Desperation Zone'. Top-tier lenders (Chase, Amex) have hard-coded rules that automatically reject applications if they detect this velocity, regardless of your score. You must allow inquiries to age past 6 months before executing a new funding sequence.",
    'INTEL-06': "The Bureau Sync Secret: Not all bureaus investigate disputes equally. TransUnion is often considered the 'weakest link' in the verification chain. By launching a highly technical Metro 2 dispute against TransUnion first and securing a deletion, you create a powerful precedent. You can then attach the TransUnion deletion confirmation to your subsequent disputes with Experian and Equifax, forcing a domino effect.",
    'INTEL-07': "The Age Accelerator: Credit Age accounts for 15% of your FICO score. If you have a 'thin file' (less than 2 years of history), no amount of perfect payments will get you to an 800. You need 'seasoned tradelines'. By being added as an Authorized User to a family member's perfect, 10-year-old credit card with a low balance, their entire 10-year history is legally copied onto your blank profile overnight.",
    'INTEL-08': "The Credit Mix Multiplier: The algorithm rewards diversity. Having 4 credit cards is good, but having 3 credit cards and 1 installment loan (like a small personal loan or auto loan) triggers the 'Credit Mix' multiplier. This shows lenders you can handle multiple types of debt instruments simultaneously. A $500 secured loan paid down to $10 remaining balance is the cheapest way to hack this multiplier.",
    'INTEL-09': "The Hard Pull Buffer: Banks use internal 'Risk Clocks'. If you apply for a credit card, get approved, and then apply for another one 2 weeks later, the system flags you as a 'Bust-Out Risk' (someone maximizing credit to default). You must enforce a strict 91-day buffer (3 full statement cycles) between major applications to reset the bank's internal sensors and appear as a low-risk, methodical borrower.",
    'INTEL-10': "The Moo Point Multiplier: The Credit U economy runs on Moo Points. While standard students grind slowly, architects leverage 'compound actions'. Sharing verified intel, linking resources, and completing advanced audits doesn't just earn points—it triggers multipliers. The fastest way to unlock top-tier assets isn't time; it's high-leverage participation in the Campus network."
};

// PDF WATERMARK TEMPLATE ENGINE
const getResourceHTML = (reward: Reward, studentName: string) => {
    let contentHTML = '';

    if (reward.id === 'RES-01') {
        contentHTML = `
            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 28px; font-weight: 900; color: #1e293b; border-bottom: 4px solid #f59e0b; padding-bottom: 10px; text-transform: uppercase; letter-spacing: -1px;">The Master Credit Report Audit [Metro 2 Protocol]</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155; display: flex; flex-direction: column; gap: 15px;">
                    <p>Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p>You have successfully unlocked the <b>Master Credit Report Review Checklist</b>. This is not a generic summary; this is the aggressive framework our top architects use to locate critical Metro 2® compliance violations hidden deep within your bureau files.</p>
                    <p>Under the Fair Credit Reporting Act (FCRA), data furnishers must report with <b>100% MAXIMUM POSSIBLE ACCURACY</b>. If a single data point is factually contradictory across Equifax, Experian, or TransUnion, the original creditor is legally bound to delete the entire tradeline. It is <i>that</i> strict.</p>
                    <p>We are searching for factual, undeniable errors to rip the accounts out of the system. Do not skip steps. Your profile must be scrubbed of conflicting personal identifiers before you challenge specific tradelines. Read carefully.</p>
                    <div style="background: #fef08a; border-left: 4px solid #ca8a04; padding: 15px; border-radius: 4px; color: #854d0e; font-weight: 700; font-style: italic;">"Money is a game. Credit is the cheat code. Finding the error is the checkmate."</div>
                </div>
            </div>

            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #dc2626; text-transform: uppercase;">Phase 1: The Identity Scrub (FCRA § 611)</h2>
                <p style="font-size: 13px; color: #64748b; margin-top: -20px; margin-bottom: 10px;">Before attacking negative accounts, sever the data links. Bureau software (e-OSCAR) verifies debts if the address tied to the debt still matches an address on your profile.</p>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #ef4444;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">1. Name & DOB Normalization</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">You are legally required to only have ONE correct name string and ONE Date of Birth.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>Identify misspellings, maiden names, middle initials, or completely incorrect names.</li>
                        <li>Demand deletion stating: "Never went by this name."</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #ef4444;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">2. The Acid Address Wash</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">Having 15 past addresses makes you look unstable and allows collectors to verify old debts.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>Remove ALL addresses except your current physical residence.</li>
                        <li>Delete ALL employment history—it has no bearing on score and only helps collectors garnish checks.</li>
                    </ul>
                </div>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #ef4444;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">3. The Secondary Bureau Trap</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">The major bureaus do not go to the courthouse. They buy data from LexisNexis, CoreLogic, and SageStream.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>If you have public records/bankruptcies, you MUST freeze LexisNexis/CoreLogic before disputing.</li>
                    </ul>
                </div>
            </div>

            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #eab308; text-transform: uppercase;">Phase 2: Technical Metro 2 Auditing</h2>
                <p style="font-size: 13px; color: #64748b; margin-top: -20px; margin-bottom: 10px;">Compare identical accounts across EQ, EXP, and TU. Any deviation across columns is an FCRA violation.</p>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #eab308;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">4. Date of Last Activity (DLA) Trap</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">This dictates the 7-year reporting clock. Collection agencies illegally change this to reset the clock (Re-aging).</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>Does the DLA match perfectly down to the month across all 3 bureaus? If not = DELETE.</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #eab308;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">5. Date Opened vs. Date Assigned</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">A collection agency cannot report a "Date Opened" that is prior to when they actually bought the debt.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>If "Date Opened" matches the original creditor's date, they are illegally assuming original creditor status.</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #eab308;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">6. The "Past Due" Balance Fraud</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">If an account is a Charge-Off or Collection, it is CLOSED. A closed account cannot have a "Past Due" balance going up every month.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>Is a Charged-Off account showing a Past Due Balance? (Violation)</li>
                        <li>Is the Collection Agency reporting 120 Days Late on a closed account? (Violation)</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #eab308;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">7. Account Type Contradictions</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">A collection string is NOT an installment loan or a revolving line of credit. It is an "Open" or "Collection" account.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>Is the collection agency reporting as an "Installment Account" or "Factoring Company Account"? If yes = DELETE.</li>
                    </ul>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 30px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #3b82f6; text-transform: uppercase;">Phase 3: The Fatal Blows & Executions</h2>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #3b82f6;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">8. The "No Double Jeopardy" Rule</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">You cannot have a balance reporting with the Original Creditor AND the Collection Agency. That is reporting double debt.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>If the Original Creditor sold the debt, their balance MUST report as $0. If it doesn't = DELETE.</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #3b82f6;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">9. Status Code Conflicts (Field 17)</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">If EQ reports Status Code 97 (Unpaid Charge-off), but EXP reports Code 93 (Collection), they are factually contradicting each other.</p>
                    <ul style="font-size: 13px; color: #475569; margin-bottom:0; padding-left: 20px;">
                        <li>Both cannot be true simultaneously. Identify the conflict and demand immediate deletion for inaccurate reporting.</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; border-left: 6px solid #3b82f6;">
                    <h3 style="font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">10. Consumer Dispute Verification (CDV) Lockout</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">Once you identify an error, write a highly technical dispute pointing out the <b>exact field</b> and <b>exact contradiction</b>. Do not say "not mine". Say: "The DLA on EQ is 04/22 but EXP is 06/22. This violates FCRA mandates for maximum accuracy. Delete completely."</p>
                </div>
            </div>
        `;
    } else if (reward.id === 'RES-02') {
        contentHTML = `
            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;">A Message from the Campus</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155;">
                    <p style="margin-bottom: 15px;">Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p style="margin-bottom: 15px;">You have successfully secured the <b>Strategic Dispute Planner</b>. Most people fail at credit repair because they treat it as a one-time letter-sending event. The bureaus count on you getting frustrated and giving up after the first generic "verified" response.</p>
                    <p style="margin-bottom: 15px;">The reality is that credit repair is a battle of attrition and procedure. It requires a sustained, multi-round systematic approach designed to trap data furnishers and bureaus in undeniable FCRA violations.</p>
                    <p style="margin-bottom: 15px;">This 90-Day Planner outlines the exact sequence required to effectively challenge reporting errors. You do not send the same letter twice. Each round escalates the legal pressure, demanding more specific proof and leveraging previous failures to comply.</p>
                    <p style="margin-top: 30px; font-weight: bold; font-style: italic;">"Patience and procedure defeat the algorithm."</p>
                </div>
            </div>

            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #3b82f6; text-transform: uppercase;">Round 1: The Factual Dispute (Days 1-35)</h2>
                
                <div style="background: #f0fdf4; border-left: 6px solid #22c55e; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                     <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #166534;">The Objective</h3>
                     <p style="font-size: 14px; color: #15803d; margin-bottom: 15px; line-height: 1.6;">Force the bureaus to launch an initial investigation based on precise, factual errors you identified during the profile scrub. <b>Do not</b> use generic templates stating "not mine." E-OSCAR instantly rejects and flags these as frivolous.</p>
                     
                     <h4 style="font-size: 15px; font-weight: bold; color: #166534; margin: 20px 0 10px 0;">Key Directives:</h4>
                     <ul style="font-size: 13px; color: #15803d; line-height: 1.6; padding-left: 20px;">
                         <li>Attack specific Metro 2 fields (e.g., "The Account Status is listed as 93 on Equifax but 97 on Experian. Delete this inaccurate data immediately.")</li>
                         <li>Wait the full 30 days mandated by the FCRA for them to complete the investigation.</li>
                         <li>Do not freeze your credit or initiate a fraud alert during this process unless you are an actual victim of identity theft.</li>
                     </ul>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 30px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #3b82f6; text-transform: uppercase;">Round 2 & 3: Escalation Protocols</h2>
                
                <div style="background: #fefce8; border-left: 6px solid #eab308; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                     <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #854d0e;">Round 2: Method of Verification Demand (Days 36-65)</h3>
                     <p style="font-size: 14px; color: #a16207; margin-bottom: 15px; line-height: 1.6;">If the bureau responds stating the account was "verified" but fails to fix the factual error, you immediately invoke FCRA § 611(a)(7).</p>
                     <ul style="font-size: 13px; color: #a16207; line-height: 1.6; padding-left: 20px;">
                         <li>Demand the exact name, business address, and telephone number of the entity they contacted to verify the information.</li>
                         <li>They legally have 15 days to provide this specific documentation.</li>
                         <li>90% of the time, they use automated E-OSCAR pings and cannot provide physical proof of verification.</li>
                     </ul>
                </div>

                <div style="background: #fef2f2; border-left: 6px solid #ef4444; padding: 25px; border-radius: 8px;">
                     <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #991b1b;">Round 3: Warning of Non-Compliance & CFPB (Days 66-90)</h3>
                     <p style="font-size: 14px; color: #b91c1c; margin-bottom: 15px; line-height: 1.6;">If they fail to provide the Method of Verification within the legal 15-day window, they have willfully violated federal law.</p>
                     <ul style="font-size: 13px; color: #b91c1c; line-height: 1.6; padding-left: 20px;">
                         <li>Send an Intent to Litigate / Demand for Deletion directly to the bureau's legal department.</li>
                         <li>Simultaneously file a complaint with the Consumer Financial Protection Bureau (CFPB) attaching proof of their failure to provide the Method of Verification.</li>
                         <li>Bureaus will often delete the account at this stage to avoid regulatory fines.</li>
                     </ul>
                </div>
            </div>
        `;
    } else if (reward.id === 'RES-03') {
        contentHTML = `
            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;">A Message from the Campus</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155;">
                    <p style="margin-bottom: 15px;">Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p style="margin-bottom: 15px;">You have successfully secured the <b>Metro 2® Compliance Guide</b>. This document is highly technical, and intentionally so. The organizations that report your data (banks, lenders, collection agencies) do not write paragraphs to the bureaus; they transmit data via a universal code known as the Metro 2 format.</p>
                    <p style="margin-bottom: 15px;">To beat the system, you must speak its language. When you dispute an account by stating "I was never 90 days late," software scans it and spits out a generic "verified" response. When you dispute an account by stating "Field 24 Payment History Profile directly conflicts with Field 17 Account Status," you force a manual review because you have identified a structural reporting violation.</p>
                    <p style="margin-bottom: 15px;">This guide highlights the most commonly abused fields in the Metro 2 array. Cross-reference these fields against your tri-merge credit report to locate undeniable violations.</p>
                    <p style="margin-top: 30px; font-weight: bold; font-style: italic;">"Speak the language of the algorithm to command it."</p>
                </div>
            </div>

            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #3b82f6; text-transform: uppercase;">Primary Targets: Account Status & History</h2>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
                     <h3 style="font-weight: 900; font-size: 18px; margin: 0 0 10px 0; color: #0f172a;">Field 17: Account Status Code</h3>
                     <p style="font-size: 14px; color: #475569; margin-bottom: 15px; line-height: 1.6;">This is the pulse of the account. It dictates whether the account is currently positive or negative. The most critical violations occur here during charge-offs and collections.</p>
                     <ul style="font-size: 13px; color: #475569; line-height: 1.6; padding-left: 20px; background: white; padding: 15px; border-radius: 6px;">
                         <li><b style="color: #ef4444;">Code 97:</b> Unpaid Charge-off</li>
                         <li><b style="color: #eab308;">Code 93:</b> Placed for Collection</li>
                         <li><b style="color: #22c55e;">Code 11:</b> Current Account</li>
                     </ul>
                     <p style="font-size: 13px; color: #b91c1c; margin-top: 15px; font-weight: bold;">VIOLATION CHECK: If Equifax lists Status Code 97, but Experian lists it as 93, the furnisher is reporting inaccurate data. Both cannot be factually true simultaneously.</p>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border: 1px solid #cbd5e1;">
                     <h3 style="font-weight: 900; font-size: 18px; margin: 0 0 10px 0; color: #0f172a;">Field 24: Payment History Profile</h3>
                     <p style="font-size: 14px; color: #475569; margin-bottom: 15px; line-height: 1.6;">This is the 24-month grid showing your payment history month by month. Creditors notoriously misuse this to punish consumers repeatedly for the same debt.</p>
                     <p style="font-size: 13px; color: #b91c1c; font-weight: bold; background: #fee2e2; padding: 15px; border-radius: 6px;">VIOLATION CHECK: Once an account hits Charge-Off (Status 97), the creditor is legally required to close the loop. They CANNOT continue to add new 30/60/90 day late marks in the months following the official charge-off date. If you see late marks generated after the account was written off, it is a massive FCRA violation.</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 30px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #3b82f6; text-transform: uppercase;">Secondary Targets: Dates & Types</h2>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
                     <h3 style="font-weight: 900; font-size: 18px; margin: 0 0 10px 0; color: #0f172a;">Field 21: Date of Last Payment (DLP)</h3>
                     <p style="font-size: 14px; color: #475569; margin-bottom: 15px; line-height: 1.6;">The DLP is critical because it powers the Statute of Limitations clock for debt collection lawsuits.</p>
                     <p style="font-size: 13px; color: #475569; font-weight: bold;">VIOLATION CHECK: Collection agencies frequently attempt "re-aging"—illegally changing the Date of Last Payment to a more recent date to keep the debt legally collectible and on your report longer. Verify this date against your own bank records.</p>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border: 1px solid #cbd5e1;">
                     <h3 style="font-weight: 900; font-size: 18px; margin: 0 0 10px 0; color: #0f172a;">Field 14: Portfolio Type</h3>
                     <p style="font-size: 14px; color: #475569; margin-bottom: 15px; line-height: 1.6;">Defines the structure of the debt. 'I' = Installment (Mortgage/Auto), 'R' = Revolving (Credit Card), 'O' = Open (Utilities/Medical).</p>
                     <p style="font-size: 13px; color: #475569; font-weight: bold;">VIOLATION CHECK: Collection agencies frequently misclassify accounts to damage your score further. For example, reporting a medical collection (Open account) as an Installment loan. This is factually incorrect and disputable.</p>
                </div>
            </div>
        `;
    } else if (reward.id === 'RES-04') {
        contentHTML = `
            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;">A Message from the Campus</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155;">
                    <p style="margin-bottom: 15px;">Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p style="margin-bottom: 15px;">You have successfully secured the <b>Debt Validation Master Class</b>. Third-party debt collectors operate on fear and ignorance. They buy massive spreadsheets of supposed "debt" for pennies on the dollar and rely on intimidation to extract payment.</p>
                    <p style="margin-bottom: 15px;">Federal Law—specifically the Fair Debt Collection Practices Act (FDCPA)—provides you with a devastating counter-attack. The moment a collector contacts you, you have the right to legally demand they prove they have the right to collect.</p>
                    <p style="margin-bottom: 15px;">This is not a polite request. It is a legal demand forcing them to produce specific documentation bridging the gap between the original creditor and their agency. If they cannot produce this documentation (and they usually cannot), they are legally prohibited from collecting the debt or reporting it to the credit bureaus.</p>
                    <p style="margin-top: 30px; font-weight: bold; font-style: italic;">"They bought a spreadsheet. Force them to prove the origin."</p>
                </div>
            </div>

            <div style="page-break-after: always; display: flex; flex-direction: column; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #dc2626; text-transform: uppercase;">Phase 1: The Initial Notice Demand</h2>
                
                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #991b1b;">Invoking FDCPA § 809</h3>
                    <p style="font-size: 14px; color: #7f1d1d; margin-bottom: 15px; line-height: 1.6;">You have exactly 30 days from their first communication (letter or phone call) to demand validation. Do not acknowledge the debt. Do not make a small payment to "make them go away."</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #dc2626;">
                        <p style="font-weight: bold; color: #991b1b; margin-bottom: 10px;">The Cease & Desist Imperative</p>
                        <p style="font-size: 13px; color: #7f1d1d; margin: 0; line-height: 1.6;">The moment your formal Debt Validation Letter is received, the collector MUST cease all collection activity. This includes phone calls, letters, and <b>especially reporting the collection to the credit bureaus</b>, until they have provided full validation.</p>
                    </div>
                </div>

                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 25px; border-radius: 8px;">
                    <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #991b1b;">Defining "Validation"</h3>
                    <p style="font-size: 14px; color: #7f1d1d; margin-bottom: 15px; line-height: 1.6;">Collectors will often mail you back a computer printout with a balance on it and claim they have "verified" the debt. This is entirely insufficient under the law.</p>
                    <ul style="font-size: 13px; color: #7f1d1d; margin: 0; padding-left: 20px; line-height: 1.6;">
                        <li style="margin-bottom: 10px;">A typed statement of balance on their letterhead is NOT validation.</li>
                        <li style="margin-bottom: 10px;">A generic bill from the original creditor without your signature is NOT validation.</li>
                        <li>They must provide competent evidence establishing legal liability and the chain of assignment.</li>
                    </ul>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 30px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #dc2626; text-transform: uppercase;">Phase 2: The Attack Requirements</h2>
                
                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 25px; border-radius: 8px;">
                    <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; color: #991b1b;">What You Must Demand</h3>
                    <p style="font-size: 14px; color: #7f1d1d; margin-bottom: 20px; line-height: 1.6;">Your letter must explicitly demand the following documentation. If they fail to provide even one piece, they have failed validation.</p>
                    
                    <ul style="font-size: 13px; color: #7f1d1d; margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li style="margin-bottom: 10px;"><b>The Original Signature:</b> A copy of the original contract or application bearing your physical signature establishing liability.</li>
                        <li style="margin-bottom: 10px;"><b>The Accounting Ledger:</b> A complete, itemized accounting showing every charge, fee, and payment starting from a zero balance to the alleged current balance.</li>
                        <li style="margin-bottom: 10px;"><b>The Chain of Assignment:</b> The specific purchase agreement or bill of sale showing the transfer of the specific account from the original creditor to the agency.</li>
                        <li><b>Licensing Verification:</b> Proof they are legally licensed and bonded to collect debt in your specific state of residence.</li>
                    </ul>

                    <p style="margin-top: 25px; font-weight: bold; font-style: italic; color: #991b1b; text-align: center;">If they fail, send a demand for deletion immediately.</p>
                </div>
            </div>
        `;
    } else {
        contentHTML = `
            <div style="display: flex; flex-direction: column; gap: 40px;">
                <div>
                    <h2 style="font-size: 18px; font-weight: 900; color: #3b82f6; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase;">Strategic Overview</h2>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <p style="margin: 0; font-size: 13px;">Review your module tasks carefully and follow standard FCRA validation guidelines.</p>
                    </div>
                </div>
            </div>
        `;
    }

    return `
<div style="width: 800px; padding: 60px; font-family: 'Inter', system-ui, sans-serif; color: #1e293b; background: white; min-height: 1050px; position: relative; box-sizing: border-box;">
    <!-- WATERMARK -->
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); width: 600px; height: 600px; background: url('/credit-cow-master-seal.png') center/contain no-repeat; opacity: 0.1; pointer-events: none; z-index: 0;"></div>
    
    <div style="position: relative; z-index: 1;">
        <div style="border-bottom: 4px solid #3b82f6; padding-bottom: 30px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: end;">
            <div>
                <h1 style="font-size: 26px; font-weight: 900; text-transform: uppercase; margin: 0; color: #0f172a; letter-spacing: -0.05em;">Credit University: ${reward.title}</h1>
                <p style="font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-top: 8px;">Official Student Resource Archive // 2026 EDITION</p>
            </div>
            <div style="text-align: right;">
                <p style="font-size: 10px; font-weight: 900; color: #3b82f6; text-transform: uppercase; margin: 0;">Authorized Student</p>
                <p style="font-size: 18px; font-weight: 900; margin: 0; text-transform: uppercase;">${studentName}</p>
            </div>
        </div>

        <div style="margin-bottom: 40px; background: #f8fafc; padding: 25px; border-radius: 20px; border-left: 6px solid #3b82f6;">
            <p style="margin: 0; font-size: 14px; font-weight: 600; font-style: italic; color: #475569;">"${reward.content}"</p>
        </div>

        ${contentHTML}

        <div style="margin-top: 60px; padding-top: 30px; border-top: 1px dashed #e2e8f0; text-align: center; color: #94a3b8; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">
            CONFIDENTIAL // CREDIT UNIVERSITY OFFICIAL DOCUMENT // DEAN ASHLEY J APPROVED
        </div>
    </div>
</div>
`;
};

export default function StudentLocker() {
    const navigate = useNavigate();
    const { getAdmissionsSession } = useDormWeek();
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<'all' | 'tip' | 'resource' | 'acceptance'>('all');
    const [userName, setUserName] = useState('Architect');
    const [showOpening, setShowOpening] = useState(false);
    const [mooPoints, setMooPoints] = useState(500);
    const [wisdomItem, setWisdomItem] = useState<Reward | null>(null);

    const getRank = (pts: number) => {
        if (pts >= 10000) return 'GRADUATE';
        if (pts >= 5000) return 'SENIOR';
        if (pts >= 2500) return 'JUNIOR';
        if (pts >= 1000) return 'SOPHOMORE';
        return 'FRESHMAN';
    };

    useEffect(() => {
        const fetchLocker = async () => {
            console.log("StudentLocker: [BOOT] v5 Absolute Visibility Check...");

            // 1. Identity Recovery
            let email = localStorage.getItem('cu_admissions_email') || '';
            let name = localStorage.getItem('cu_admissions_name') || '';

            // Mandatory Fallback for Primary User
            if (email === '' || email === 'undefined' || email === null) {
                console.warn("StudentLocker: [TELEMETRY] Identity missing. Using ASHLEY Fallback.");
                email = 'awlabounty80@gmail.com';
                name = 'ASHLEY';
                localStorage.setItem('cu_admissions_email', email);
                localStorage.setItem('cu_admissions_name', name);
            }

            setUserName(name || 'Architect');

            // Synchronize Gamification Wallet
            const localMooStr = localStorage.getItem(`cu_moo_points_${email}`);
            if (localMooStr) {
                setMooPoints(parseInt(localMooStr));
            } else {
                setMooPoints(500); // Base Windfall
                localStorage.setItem(`cu_moo_points_${email}`, '500');
            }

            // SAFETY TIMEOUT: Ensure loading never lasts more than 1 second, and force guarantees
            const safetyTimer = setTimeout(() => {
                console.warn("StudentLocker: [SAFETY] Data fetch hanging. Intercepting and forcing guarantees.");
                setRewards([
                    LOCAL_REWARD_POOL.find(r => r.id === 'INTEL-01')!,
                    LOCAL_REWARD_POOL.find(r => r.id === 'RES-01')!,
                    LOCAL_REWARD_POOL.find(r => r.id === 'ACC-01')!
                ]);
                setLoading(false);
            }, 1000);

            // 2. Collection Pass: Reward IDs
            let rewardIds: string[] = [];

            try {
                // A: ZERO-LATENCY LOCAL CACHE (Primary) ⚡
                // We instantly pull from their browser since they just won them 2 seconds ago.
                const session = await getAdmissionsSession(email);
                if (session && session.rewards_won && session.rewards_won.length > 0) {
                    console.log("StudentLocker: [TELEMETRY] Fast-loading from Local Session");
                    rewardIds = session.rewards_won;
                    
                    // We only show the cinematic box if they haven't seen it
                    if (!localStorage.getItem(`seen_moo_modal_${email}`)) {
                         setShowOpening(true);
                         localStorage.setItem(`seen_moo_modal_${email}`, 'true');
                    }
                }

                // B: DATABASE FALLBACK (Secondary)
                // If local cache is cleared or they are on a new device, pull from cloud
                if (rewardIds.length === 0) {
                    console.log("StudentLocker: [TELEMETRY] Local session empty. Querying Database...");
                    const { data: dbLocker, error: dbError } = await supabase.from('dormweek_student_locker').select('reward_id').eq('email', email);
                    
                    if (dbError) {
                        console.warn("StudentLocker: Supabase fetch error:", dbError.message);
                    } else if (dbLocker && dbLocker.length > 0) {
                        rewardIds = dbLocker.map(d => d.reward_id).filter(Boolean) as string[];
                    }
                }

                // C: Universal Fallback (Guaranteed Assets)
                if (rewardIds.length === 0) {
                    console.log("StudentLocker: [TELEMETRY] Data missing. Forcing local guarantees.");
                    // Fallback to exactly what the cinematic machine awards
                    const defaultIds = ['INTEL-01', 'RES-01', 'ACC-01'];
                    
                    // Only show the modal if we are forced to fallback AND they haven't seen it this session
                    // We'll just show it to ensure they get the cinematic feel
                    setShowOpening(true); 
                    
                    setRewards([
                        LOCAL_REWARD_POOL.find(r => r.id === 'INTEL-01')!,
                        LOCAL_REWARD_POOL.find(r => r.id === 'RES-01')!, // Needs to use standard RES index, 1 or randomly picked. Let's give them the main Checklist
                        LOCAL_REWARD_POOL.find(r => r.id === 'ACC-01')!
                    ]);
                    
                    clearTimeout(safetyTimer);
                    setLoading(false);
                    return; // Jump out early, rewards are fully set to standards
                }

                // 3. Resolution Pass: Full Metadata (If we do have IDs)
                const { data: poolData, error: poolError } = await supabase.from('dormweek_reward_pool').select('*').in('id', rewardIds);
                
                if (poolError) {
                    console.warn("StudentLocker: Reward pool fetch error:", poolError.message);
                }

                const dbPool = poolData || [];
                let finalSet = rewardIds.map(id => {
                    return dbPool.find(r => r.id === id) || LOCAL_REWARD_POOL.find(r => r.id === id);
                }).filter(Boolean) as Reward[];

                // Ensure they always have at least 1 Tip, 1 Resource, and 1 Acceptance
                if (!finalSet.some(r => r.type === 'tip')) {
                    const tip = LOCAL_REWARD_POOL.find(r => r.id === 'INTEL-01');
                    if (tip) finalSet.unshift(tip);
                }
                if (!finalSet.some(r => r.type === 'resource')) {
                    const res = LOCAL_REWARD_POOL.find(r => r.id === 'RES-01');
                    if (res) finalSet.push(res);
                }
                if (!finalSet.some(r => r.type === 'acceptance')) {
                    const acc = LOCAL_REWARD_POOL.find(r => r.id === 'ACC-01');
                    if (acc) finalSet.push(acc);
                }

                // Ultimate Failsafe: If resolution somehow yields 0 items, force injection.
                if (finalSet.length === 0) {
                    console.warn("StudentLocker: [TELEMETRY] Final Set empty despite IDs! Forcing defaults.");
                    finalSet = [
                        LOCAL_REWARD_POOL.find(r => r.id === 'INTEL-01')!,
                        LOCAL_REWARD_POOL.find(r => r.id === 'RES-01')!,
                        LOCAL_REWARD_POOL.find(r => r.id === 'ACC-01')!
                    ];
                }

                console.log("StudentLocker: [TELEMETRY] Final Set:", finalSet);
                setRewards(finalSet);
            } catch (err) {
                console.error("StudentLocker: [CRITICAL] Fetch failed:", err);
                
                // Absolute Error Hard-Fallback
                setRewards([
                    LOCAL_REWARD_POOL.find(r => r.id === 'INTEL-01')!,
                    LOCAL_REWARD_POOL.find(r => r.id === 'RES-01')!,
                    LOCAL_REWARD_POOL.find(r => r.id === 'ACC-01')!
                ]);
            } finally {
                clearTimeout(safetyTimer);
                setLoading(false);
            }
        };

        fetchLocker();
    }, [getAdmissionsSession]);

    const filteredRewards = rewards.filter(r =>
        selectedType === 'all' ? true : r.type === selectedType
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-amber-500 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Vault Assets...</p>
            </div>
        );
    }

    if (showOpening) {
        return (
            <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-6 text-center space-y-8 overflow-hidden text-white selection:bg-amber-500/30">
                {/* Antigravity Cinematic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.2)_0%,black_70%)] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotateX: 45 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="relative z-10 p-12 bg-gradient-to-br from-[#0f172a]/90 to-black rounded-[4rem] border-2 border-amber-500/30 shadow-[0_0_100px_rgba(245,158,11,0.3),inset_0_0_40px_rgba(245,158,11,0.1)] flex items-center justify-center backdrop-blur-3xl group"
                >
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2)_0%,transparent_100%)] rounded-[4rem] pointer-events-none"
                    />
                    <Trophy className="w-40 h-40 text-amber-500 drop-shadow-[0_0_30px_#f59e0b] group-hover:scale-110 transition-transform duration-700" />
                </motion.div>

                <div className="space-y-4 max-w-3xl px-6 relative z-10 pt-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10, delay: 0.2 }}
                        className="inline-flex px-8 py-3 rounded-full border border-amber-500/50 bg-amber-500/10 backdrop-blur-md text-amber-400 font-black uppercase tracking-[0.3em] text-xs mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                        <Zap className="w-4 h-4 mr-2" /> +500 MOO POINTS AWARDED
                    </motion.div>
                    
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl md:text-8xl lg:text-[7rem] font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] leading-none"
                    >
                        Admission <br/> Bonus
                    </motion.h2>
                    
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-300 text-xl md:text-2xl font-bold uppercase tracking-widest pt-4 max-w-2xl mx-auto border-t border-amber-500/20"
                    >
                        Welcome to the Campus. Your starting vault balance has been officially credited.
                    </motion.p>
                </div>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => {
                        console.log("StudentLocker: Unlocking Vault...");
                        confetti({
                            particleCount: 150,
                            spread: 100,
                            origin: { y: 0.6 },
                            colors: ['#f59e0b', '#fbbf24', '#ffffff', '#eab308'],
                            zIndex: 9999
                        });
                        setShowOpening(false);
                    }}
                    className="relative z-10 px-12 h-20 bg-amber-500 text-black font-black uppercase tracking-[0.4em] rounded-full hover:scale-105 hover:bg-amber-400 transition-all shadow-[0_0_40px_rgba(245,158,11,0.4)] active:scale-95"
                >
                    Unlock My Vault
                </motion.button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Antigravity Premium Layering */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
            
            <div className="fixed top-6 left-6 z-[60]">
                <button
                    onClick={() => navigate('/learn')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors backdrop-blur-md"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to The Yard
                </button>
            </div>

            {/* Main Content Scroll Area */}
            <div className="relative z-10 max-w-7xl mx-auto space-y-12 mt-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12 pt-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500">
                            <Lock className="w-3 h-3" />
                            Secure Assets
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                            The Locker
                        </h1>
                        <p className="text-slate-400 text-xl font-medium max-w-xl">
                            Archived rewards from your Admissions Sequence. Use these tools to architect your 700+ profile.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Authorized Student</p>
                            <p className="text-xl font-black italic uppercase">{userName}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Filter & Stats Bar */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setSelectedType('all')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'all' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                        >
                            All Assets
                        </button>
                        <button
                            onClick={() => setSelectedType('tip')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'tip' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-white'}`}
                        >
                            Majo Tips
                        </button>
                        <button
                            onClick={() => setSelectedType('resource')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'resource' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-slate-500 hover:text-white'}`}
                        >
                            Tools
                        </button>
                        <button
                            onClick={() => setSelectedType('acceptance')}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === 'acceptance' ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-white'}`}
                        >
                            Prizes
                        </button>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Moo Points</p>
                            <p className="text-2xl font-black italic text-emerald-400">{mooPoints}</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Assets</p>
                            <p className="text-2xl font-black italic">{rewards.length}</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Rank</p>
                            <p className="text-2xl font-black italic text-amber-500">{getRank(mooPoints)}</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-white/5 rounded-[3rem] animate-pulse border border-white/10" />
                        ))
                    ) : filteredRewards.length === 0 ? (
                        <div className="col-span-full py-32 text-center space-y-6">
                            <div className="inline-flex p-8 bg-white/5 rounded-[3rem] border border-white/5 grayscale">
                                <Lock className="w-16 h-16 opacity-30" />
                            </div>
                            <h3 className="text-3xl font-black uppercase italic text-slate-600">No Assets Unlocked</h3>
                            <button
                                onClick={() => navigate('/admissions')}
                                className="text-amber-500 font-bold uppercase tracking-widest text-sm underline underline-offset-8"
                            >
                                Return to Admissions Center
                            </button>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredRewards.map((reward, i) => (
                                <motion.div
                                    key={reward.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`relative group bg-[#0a0f2d] border-2 ${reward.type === 'tip' ? 'hover:border-blue-500/50' : reward.type === 'resource' ? 'hover:border-amber-500/50' : 'hover:border-indigo-500/50'} rounded-[3rem] p-8 transition-all duration-500`}
                                >
                                    <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        {reward.type === 'tip' ? <Sparkles className="w-24 h-24" /> : reward.type === 'resource' ? <Gift className="w-24 h-24" /> : <Trophy className="w-24 h-24" />}
                                    </div>

                                    <div className="space-y-6">
                                        <div className={`inline-flex p-4 rounded-2xl ${reward.type === 'tip' ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20' : reward.type === 'resource' ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-600/10 text-indigo-500 border border-indigo-500/20'}`}>
                                            {reward.type === 'tip' ? <Zap className="w-6 h-6" /> : reward.type === 'resource' ? <FileText className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase leading-tight group-hover:text-white transition-colors">
                                                {reward.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 italic border-l-2 border-white/5 pl-4">
                                                "{reward.content}"
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                                            {reward.type === 'resource' ? (
                                                <div className="flex flex-col gap-2 w-full">
                                                    <button
                                                        onClick={async () => {
                                                            const btn = document.activeElement as HTMLButtonElement;
                                                            if (btn) btn.disabled = true;

                                                            try {
                                                                console.log("StudentLocker: [PDF] Module loading...");
                                                                const html2pdfModule = await import('html2pdf.js');
                                                                const generatePdf = (html2pdfModule.default ? html2pdfModule.default : html2pdfModule) as any;
                                                                
                                                                // Create a visible (but off-screen) container to force layout painting
                                                                const element = document.createElement("div");
                                                                element.innerHTML = getResourceHTML(reward, userName);
                                                                element.style.position = 'fixed';
                                                                element.style.left = '-2000px';
                                                                element.style.top = '0';
                                                                element.style.width = '800px';
                                                                element.style.backgroundColor = '#ffffff';
                                                                element.style.zIndex = '-9999';
                                                                document.body.appendChild(element);

                                                                // Wait for layout and styles to calculate
                                                                await new Promise(resolve => setTimeout(resolve, 500));

                                                                const opt = {
                                                                    margin: 15,
                                                                    filename: `${reward.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
                                                                    image: { type: 'jpeg', quality: 0.98 },
                                                                    html2canvas: {
                                                                        scale: 2,
                                                                        useCORS: true,
                                                                        logging: true,
                                                                        letterRendering: true,
                                                                        windowWidth: 800
                                                                    },
                                                                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                                                                };

                                                                await generatePdf().set(opt).from(element).save();
                                                                document.body.removeChild(element);
                                                                console.log("StudentLocker: [PDF] Generation Finalized.");
                                                            } catch (err) {
                                                                console.error("StudentLocker: [PDF] Fatal Execution Error:", err);
                                                                if (reward.download_url) window.open(reward.download_url, '_blank');
                                                                else alert("Engine failure. Please try direct download link.");
                                                            } finally {
                                                                if (btn) btn.disabled = false;
                                                            }
                                                        }}
                                                        className="w-full bg-white text-black h-14 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform disabled:opacity-50"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Generate PDF Tool
                                                    </button>
                                                    {reward.download_url && (
                                                        <a 
                                                            href={reward.download_url} 
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center hover:text-white transition-colors"
                                                        >
                                                            Trouble? Direct Download
                                                        </a>
                                                    )}
                                                </div>
                                            ) : reward.type === 'acceptance' ? (
                                                <button
                                                    onClick={() => navigate('/learn')}
                                                    className="flex-1 bg-indigo-600 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-colors"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                    Enter The Yard
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setWisdomItem(reward)}
                                                    className="flex-1 bg-blue-600 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors"
                                                >
                                                    <Sparkles className="w-4 h-4" />
                                                    View Wisdom
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Next Milestone Callout */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 mt-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-white opacity-5 rotate-12 translate-x-12 translate-y-12 pointer-events-none" />

                    <div className="flex-1 space-y-4 relative z-10 text-left">
                        <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white">
                            Next Objective
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Enter The Yard Classroom</h2>
                        <p className="text-white/80 text-xl font-medium max-w-xl">
                            Unlock your Freshman Curriculum and start the transition towards Credit Leadership. Your journey has only begun.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/learn')}
                        className="w-full md:w-auto px-12 h-20 bg-white text-blue-700 font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 text-lg group"
                    >
                        Enter Campus
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Wisdom Modal */}
            <AnimatePresence>
                {wisdomItem && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setWisdomItem(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0a0f2d] border border-blue-500/30 rounded-3xl p-8 md:p-12 shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600 opacity-[0.03] rotate-12 translate-x-12 translate-y-12 pointer-events-none" />
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-600/20 text-blue-500 rounded-xl">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-1">Deep Insight Protocol</p>
                                    <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tighter leading-none">{wisdomItem.title}</h2>
                                </div>
                            </div>

                            <div className="bg-black/60 border border-white/5 rounded-2xl p-6 mb-8 mt-6">
                                <p className="text-blue-400 text-sm md:text-base leading-relaxed italic border-l-4 border-blue-500 pl-4 font-medium mb-6">
                                    "{wisdomItem.content}"
                                </p>
                                <div className="text-slate-300 text-sm md:text-base leading-relaxed space-y-4">
                                    {(DEEP_WISDOM_DETAILS[wisdomItem.id] || "This represents foundational financial architecture. Study its implications closely, as its precise application separates students from masters.").split('\n').map((para: string, idx: number) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setWisdomItem(null)}
                                className="w-full bg-blue-600 text-white font-black uppercase tracking-[0.2em] h-14 rounded-xl hover:bg-blue-500 transition-colors"
                            >
                                Secure Insight
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
