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

// PDF WATERMARK TEMPLATE ENGINE
const getResourceHTML = (reward: Reward, studentName: string) => {
    let contentHTML = '';

    if (reward.id === 'RES-01') {
        contentHTML = `
            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;">A Message from the Campus</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155;">
                    <p style="margin-bottom: 15px;">Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p style="margin-bottom: 15px;">You have successfully secured the <b>Credit Report Review Checklist</b>. This is not a generic summary; this is the exact framework our top architects use to locate critical Metro 2® compliance violations hidden deep within your bureau files.</p>
                    <p style="margin-bottom: 15px;">Most consumers glance at their credit score and assume the data dictating it is accurate. The reality is that the credit reporting system is fraught with automated errors, mixed files, and illegal reporting practices by data furnishers. Under the Fair Credit Reporting Act (FCRA), you possess the absolute right to demand maximum possible accuracy.</p>
                    <p style="margin-bottom: 15px;">We have divided this audit into <b>Three Crucial Phases</b> spanning the next few pages. Do not skip steps. Your profile must be scrubbed of conflicting personal identifiers before you challenge specific tradelines. Read the instructions carefully, verify your files across all three major bureaus, and prepare to hold the system accountable.</p>
                    <p style="margin-top: 30px; font-weight: bold; font-style: italic;">"Money is a game. Credit is the cheat code. Learn the rules to win."</p>
                </div>
            </div>

            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #3b82f6; text-transform: uppercase;">Phase 1: Personal Profile Scrub (FCRA § 611)</h2>
                <p style="font-size: 13px; color: #64748b; margin-top: -20px; margin-bottom: 10px;">Before attacking negative accounts, you must sever the data links tying those accounts to you. Bureau software (e-OSCAR) automatically verifies disputed debts if the address tied to the debt still matches an address on your profile.</p>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <h3 style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 15px;">1. Name Normalization</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">You are legally required to only have ONE correct, properly spelled name on your credit file. If you see misspellings, maiden names, or completely incorrect names, these are often errors created by lenders merging files.</p>
                    <ul style="font-size: 13px; color: #475569; padding-left: 20px;">
                        <li>Identify everything that is not your exact, current legal name.</li>
                        <li>Demand deletion stating: "Never went by this name."</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <h3 style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 15px;">2. Address & Employment Freeze</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">Debt collectors use old addresses and past employers to locate you and verify old accounts. Having 15 past addresses makes you look unstable to auto lenders.</p>
                    <ul style="font-size: 13px; color: #475569; padding-left: 20px;">
                        <li>Remove ALL addresses except your current physical residence.</li>
                        <li>Remove ALL phone numbers except your current primary mobile.</li>
                        <li>Delete ALL employment history—it has no bearing on your score and only serves debt collectors.</li>
                    </ul>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 30px;">
                <h2 style="font-size: 22px; font-weight: 900; color: #3b82f6; text-transform: uppercase;">Phase 2 & 3: Negative Account Auditing</h2>
                
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <h3 style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 15px;">3. The DLA Sweep (Date of Last Activity)</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">The DLA is the most important date on a negative account because it dictates the 7-year reporting clock. Collection agencies often try to illegally change this date to keep the debt on your report longer (Re-aging).</p>
                    <ul style="font-size: 13px; color: #475569; padding-left: 20px;">
                        <li>Compare the exact DLA for the <b>same account</b> across Equifax, Experian, and TransUnion.</li>
                        <li>If the dates do not match perfectly, the furnisher is violating Metro 2 standards.</li>
                        <li>This is an actionable dispute for factual inaccuracy.</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <h3 style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 15px;">4. High Balance vs. Reporting Limit</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">Look closely at charged-off credit cards. Once an account is charged off, the creditor cannot continue to report the balance exceeding the credit limit while also reporting it as closed.</p>
                    <ul style="font-size: 13px; color: #475569; padding-left: 20px;">
                        <li>Check if the reported balance is higher than the original high limit.</li>
                        <li>Verify if late payments are being reported <b>after</b> the charge-off date.</li>
                    </ul>
                </div>

                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 15px;">5. The Secondary Bureau Trap</h3>
                    <p style="font-size: 13px; color: #475569; margin-bottom: 10px;">The major bureaus do not go to the courthouse to verify bankruptcies and tax liens. They buy this data from secondary companies like LexisNexis and CoreLogic.</p>
                    <ul style="font-size: 13px; color: #475569; padding-left: 20px;">
                        <li>If you have public records, you must request a security freeze on LexisNexis and CoreLogic <b>before</b> disputing the public record with the big three.</li>
                    </ul>
                </div>
            </div>
        `;
    } else if (reward.id === 'RES-02') {
        contentHTML = `
            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;">A Message from the Campus</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155;">
                    <p style="margin-bottom: 15px;">Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p style="margin-bottom: 15px;">You have successfully secured the <b>Strategic Dispute Planner</b>. Most people fail at credit repair because they treat it as a one-time letter-sending event. The bureaus count on you getting frustrated and giving up after the first generic "verified" response.</p>
                    <p style="margin-bottom: 15px;">The reality is that credit repair is a battle of attrition and procedure. It requires a sustained, multi-round systematic approach designed to trap data furnishers and bureaus in undeniable FCRA violations.</p>
                    <p style="margin-bottom: 15px;">This 90-Day Planner outlines the exact sequence required to effectively challenge reporting errors. You do not send the same letter twice. Each round escalates the legal pressure, demanding more specific proof and leveraging previous failures to comply.</p>
                    <p style="margin-top: 30px; font-weight: bold; font-style: italic;">"Patience and procedure defeat the algorithm."</p>
                </div>
            </div>

            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
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

            <div style="display: grid; grid-template-columns: 1fr; gap: 30px;">
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
            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;">A Message from the Campus</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155;">
                    <p style="margin-bottom: 15px;">Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p style="margin-bottom: 15px;">You have successfully secured the <b>Metro 2® Compliance Guide</b>. This document is highly technical, and intentionally so. The organizations that report your data (banks, lenders, collection agencies) do not write paragraphs to the bureaus; they transmit data via a universal code known as the Metro 2 format.</p>
                    <p style="margin-bottom: 15px;">To beat the system, you must speak its language. When you dispute an account by stating "I was never 90 days late," software scans it and spits out a generic "verified" response. When you dispute an account by stating "Field 24 Payment History Profile directly conflicts with Field 17 Account Status," you force a manual review because you have identified a structural reporting violation.</p>
                    <p style="margin-bottom: 15px;">This guide highlights the most commonly abused fields in the Metro 2 array. Cross-reference these fields against your tri-merge credit report to locate undeniable violations.</p>
                    <p style="margin-top: 30px; font-weight: bold; font-style: italic;">"Speak the language of the algorithm to command it."</p>
                </div>
            </div>

            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
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

            <div style="display: grid; grid-template-columns: 1fr; gap: 30px;">
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
            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
                <h2 style="font-size: 24px; font-weight: 900; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase;">A Message from the Campus</h2>
                <div style="font-size: 14px; line-height: 1.8; color: #334155;">
                    <p style="margin-bottom: 15px;">Welcome to Credit University, <b>${studentName}</b>.</p>
                    <p style="margin-bottom: 15px;">You have successfully secured the <b>Debt Validation Master Class</b>. Third-party debt collectors operate on fear and ignorance. They buy massive spreadsheets of supposed "debt" for pennies on the dollar and rely on intimidation to extract payment.</p>
                    <p style="margin-bottom: 15px;">Federal Law—specifically the Fair Debt Collection Practices Act (FDCPA)—provides you with a devastating counter-attack. The moment a collector contacts you, you have the right to legally demand they prove they have the right to collect.</p>
                    <p style="margin-bottom: 15px;">This is not a polite request. It is a legal demand forcing them to produce specific documentation bridging the gap between the original creditor and their agency. If they cannot produce this documentation (and they usually cannot), they are legally prohibited from collecting the debt or reporting it to the credit bureaus.</p>
                    <p style="margin-top: 30px; font-weight: bold; font-style: italic;">"They bought a spreadsheet. Force them to prove the origin."</p>
                </div>
            </div>

            <div style="page-break-after: always; display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px;">
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

            <div style="display: grid; grid-template-columns: 1fr; gap: 30px;">
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
            <div style="display: grid; grid-template-columns: 1fr; gap: 40px;">
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

    if (showOpening) {
        return (
            <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-6 text-center space-y-8 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    className="p-12 bg-blue-600 rounded-[4rem] shadow-[0_0_100px_rgba(37,99,235,0.4)] relative"
                >
                    <Trophy className="w-32 h-32 text-white" />
                    <motion.div
                        animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-white rounded-[4rem]"
                    />
                </motion.div>

                <div className="space-y-4 max-w-2xl px-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10 }}
                        className="inline-flex px-6 py-2 rounded-full bg-amber-500 text-black font-black uppercase tracking-widest text-sm mb-4"
                    >
                        +500 MOO POINTS AWARDED
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl font-black uppercase italic tracking-tighter"
                    >
                        Admission Bonus
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-xl font-bold uppercase italic"
                    >
                        Welcome to the Campus. Your starting balance has been credited.
                    </motion.p>
                </div>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => {
                        console.log("StudentLocker: Unlocking Vault...");
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                        setShowOpening(false);
                    }}
                    className="px-12 h-20 bg-white text-black font-black uppercase tracking-widest rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.2)]"
                >
                    Access Your Vault
                </motion.button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 pb-32">
            <div className="fixed top-6 left-6 z-50">
                <button
                    onClick={() => navigate('/learn')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to The Yard
                </button>
            </div>

            {/* Header Section */}
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
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
                                                    {reward.id === 'RES-01' && (
                                                        <button 
                                                            onClick={() => navigate('/dashboard/credit-lab/audit-checklist')}
                                                            className="w-full bg-blue-600 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-colors shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            View Interactive Guide
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={async () => {
                                                            const btn = document.activeElement as HTMLButtonElement;
                                                            if (btn) btn.disabled = true;

                                                            try {
                                                                console.log("StudentLocker: [PDF] Initializing Engine...");

                                                                // Get raw HTML String
                                                                const htmlString = getResourceHTML(reward, userName);

                                                                const opt = {
                                                                    margin: 10,
                                                                    filename: `${reward.title}-${userName}.pdf`,
                                                                    image: { type: 'jpeg', quality: 0.98 },
                                                                    html2canvas: {
                                                                        scale: 2,
                                                                        useCORS: true,
                                                                        letterRendering: true,
                                                                        backgroundColor: '#ffffff'
                                                                    },
                                                                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                                                                };

                                                                console.log("StudentLocker: [PDF] capturing...");

                                                                // By passing the string directly, html2pdf manages its own hidden iframe
                                                                // This completely eliminates the blank-page CSS rendering bug
                                                                await html2pdf().from(htmlString).set(opt).save();

                                                                console.log("StudentLocker: [PDF] Success.");
                                                            } catch (err) {
                                                                console.error("StudentLocker: [PDF] Error:", err);
                                                                if (reward.download_url) window.open(reward.download_url, '_blank');
                                                                else alert("PDF generation failed. Using secondary download link...");
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
                                                            download
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
                                                    onClick={() => alert(`Wisdom Insight: ${reward.content}`)}
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
        </div>
    );
}
