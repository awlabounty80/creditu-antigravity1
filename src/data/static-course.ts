/**
 * STATIC COURSE DATA - FRESHMAN FOUNDATIONS
 * Direct course object with all 100 lessons embedded
 */

import { COMPLETE_100_LESSONS } from './complete-100-lessons';


// Create the complete course with all lessons
export const FRESHMAN_FOUNDATIONS_COURSE = {
    id: 'freshman-foundations',
    title: 'Freshman: Foundations of Credit',
    description: 'Master the fundamentals of credit with 100 source-verified lessons from DR_LEVERAGE.',
    level: 'FRESHMAN',
    track: 'Foundations',
    progress: 0,
    modules: Array.from({ length: 10 }, (_, moduleIndex) => ({
        id: `mod-${moduleIndex + 1}`,
        title: `Module ${moduleIndex + 1}: Lessons ${moduleIndex * 10 + 1}-${(moduleIndex + 1) * 10}`,
        description: `Credit education module ${moduleIndex + 1}`,
        order_index: moduleIndex,
        lessons: COMPLETE_100_LESSONS.slice(moduleIndex * 10, (moduleIndex + 1) * 10).map((lesson, lessonIndex) => {
            const globalIndex = moduleIndex * 10 + lessonIndex;

            // SYSTEM CORRECTION - BIND TO BRANDED PLACEHOLDER FOR PENDING CONTENT
            // Default Video: Credit U Official Placeholder
            let videoUrl = '/assets/logo-animated.mp4?v=placeholder';

            // Schema Sync: Custom IDs for core lessons
            let finalId = lesson.lessonId;
            let finalTitle = lesson.lessonTitle;

            // Default Markdown: Standard Template with Placeholders
            let markdownContent = `# ${lesson.lessonTitle}

## Teaching Objective
${lesson.teachingObjective}

## Introduction
${lesson.structurePoints.introContext}

## Core Instruction
${lesson.structurePoints.coreInstruction.map((point, i) => `${i + 1}. ${point}`).join('\n\n')}

## Summary
${lesson.structurePoints.reinforcementSummary}

---
**Professor**: ${lesson.professorPersonaId}  
**Duration**: ${lesson.minutes} minutes  
**Level**: ${lesson.courseLevel}
**Status**: Ready to Play`;

            // --- ARCHITECT OVERRIDES (PROPER VIDEO SOURCES) ---
            let externalResourceUrl = 'https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/';
            let externalResourceTitle = 'CFPB: Understanding Credit Tools';

            // Lesson 1.1: Welcome to the Wealth Game
            if (globalIndex === 0) {
                finalId = 'welcome-wealth-game';
                finalTitle = 'Welcome to the Wealth Game';
                videoUrl = '/assets/logo-animated.mp4?v=generative-advanced'; // Promote to advanced
                externalResourceUrl = 'https://vimeo.com/352068774';
                externalResourceTitle = 'Identity Matters: Credit Education Video';
                markdownContent = `# Welcome to the Wealth Game (Professor Experience)`;

                // GENERATIVE TRANSCRIPT - BOUND TO FTC COMPLIANCE
                (lesson as any).transcript = "Welcome to the Wealth Game. I’m your professor, Dr. Leverage. Most people are taught that credit is a trap, a way to keep you in debt. They use it for shoes, dinners, and liabilities. That is the old way, the 'Consumer Mindset.' Here at Credit U, we build Architects. We view credit as a tool for Leverage. In the Wealth Game, cash is for spending, but Credit is for building. Your credit report isn't a judgment of your worth; it's a scoreboard of your discipline. A high score tells the world, 'I keep my promises.' Cash takes years to save. Credit allows you to access capital today to buy assets that pay you tomorrow. You are not here to fix a number; you are here to build a dynasty. Let's begin the mindset reset.";
            }
            // Lesson 1.2: The Matrix
            else if (globalIndex === 1) {
                finalId = 'the-matrix';
                finalTitle = 'The Matrix (How It Works)';
                videoUrl = '/assets/dr-leverage-matrix.mp4?v=generative-advanced';
                externalResourceUrl = 'https://www.khanacademy.org/college-careers-more/financial-literacy';
                externalResourceTitle = 'Khan Academy: What is a Credit Score?';

                (lesson as any).transcript = "Welcome to the Freshman level. You’ve had your orientation, but now it’s time to see the code behind the curtain. Think of the three major bureaus—Equifax, Experian, and TransUnion—as the architects of your digital reality. They don't just 'have' your data; they categorize every financial move you make. Every late payment, every new inquiry, every high balance... it’s all fed into a mathematical formula known as FICO. This isn't just a number; it’s a living algorithm. If you don't understand the weights—Payment History at 35%, Credit Utilization at 30%—you're playing a game where the rules are hidden. Today, we're going to hack the algorithm. We’re going to show you exactly how to manipulate those percentages to your advantage. Step into the Matrix.";
            }
            // Lesson 1.3: The 5 Pillars of Power
            else if (globalIndex === 2) {
                finalId = 'the-5-pillars';
                finalTitle = 'The 5 Pillars of Power';
                videoUrl = 'https://www.youtube.com/embed/fG0SST-o-yE';
                externalResourceUrl = 'https://www.myfico.com/credit-education/whats-in-your-credit-score';
                externalResourceTitle = 'myFICO: What\'s in your Score?';
            }
            // Lesson 1.4: Debt vs. Leverage (USER LINK)
            else if (globalIndex === 3) {
                finalId = 'debt-vs-leverage';
                finalTitle = 'Debt vs. Leverage';
                videoUrl = 'https://www.youtube.com/embed/ViLXWX9reN8?start=127';
                externalResourceUrl = 'https://youtu.be/ViLXWX9reN8?t=127';
                externalResourceTitle = 'Educational Resource: Debt vs Leverage';
            }
            // Lesson 1.5: Rules of Engagement (FCRA)
            else if (globalIndex === 4) {
                finalId = 'fcra-rights';
                finalTitle = 'The Rules of Engagement (FCRA Rights)';
                videoUrl = '/assets/logo-animated.mp4?v=generative-advanced';
                externalResourceUrl = 'https://www.consumer.ftc.gov/articles/pdf-0096-fair-credit-reporting-act.pdf';
                externalResourceTitle = 'FTC: Fair Credit Reporting Act Guide';

                (lesson as any).transcript = "The Fair Credit Reporting Act is your constitutional document in the world of credit. It dictates what the bureaus can and cannot do. If you don't know your rights, you're playing a game without a rulebook. Today, we're giving you the legal ammunition to protect your profile.";
            }
            // Lesson 1.6: Financial Avatar
            else if (globalIndex === 5) {
                finalId = 'financial-avatar';
                finalTitle = 'Your Financial Avatar';
                videoUrl = 'https://www.youtube.com/embed/v9E492G-bIs';
                externalResourceUrl = 'https://www.experian.com/blogs/ask-experian/credit-education/report-basics/how-to-read-your-credit-report/';
                externalResourceTitle = 'Experian: How to Read Your Report';
            }
            // Lesson 1.7: Mission 800
            else if (globalIndex === 6) {
                finalId = 'mission-800';
                finalTitle = 'Mission 800 (Setting the Target)';
                videoUrl = 'https://www.youtube.com/embed/d-7hY37k6_Q';
                externalResourceUrl = 'https://www.myfico.com/credit-education/credit-scores/payment-history';
                externalResourceTitle = 'myFICO: Payment History Details';
            }
            // Lesson 2.1: Reading the Scoreboard
            else if (globalIndex === 7) {
                finalId = 'reading-the-scoreboard';
                finalTitle = 'Reading the Scoreboard';
                videoUrl = 'https://www.youtube.com/embed/3E_v36N26l8';
                externalResourceUrl = 'https://www.myfico.com/credit-education/credit-scores/amount-of-debt';
                externalResourceTitle = 'myFICO: Amounts Owed (30%)';
            }
            // Lesson 2.2: The 35% Rule
            else if (globalIndex === 8) {
                finalId = 'the-35-percent-rule';
                finalTitle = 'The 35% Rule (Perfect Payment)';
                videoUrl = 'https://www.youtube.com/embed/-FATtQLu_-M';
                externalResourceUrl = 'https://www.myfico.com/credit-education/credit-scores/length-of-credit-history';
                externalResourceTitle = 'myFICO: Length of History (15%)';
            }
            // Lesson 2.3: Utilization Magic
            else if (globalIndex === 9) {
                finalId = 'utilization-magic';
                finalTitle = 'Utilization Magic (The 30/10/0 Rule)';
                videoUrl = 'https://www.youtube.com/embed/zPnBG_6M99o';
                externalResourceUrl = 'https://www.myfico.com/credit-education/credit-scores/credit-mix';
                externalResourceTitle = 'myFICO: Credit Mix & New Credit (20%)';
            }

            return {
                id: finalId,
                title: finalTitle,
                content_markdown: markdownContent,
                video_url: videoUrl,
                duration_minutes: lesson.minutes,
                type: 'video' as const,
                is_free_preview: globalIndex < 5,
                order_index: lessonIndex,
                isCompleted: false,
                isLocked: false,
                // MANDATORY VIDEO OBJECT WITH AUTHORIZED EXTERNAL RESOURCES
                video_object: {
                    type: (globalIndex < 10) ? 'ai_professor' : 'placeholder',
                    title: (globalIndex < 10) ? finalTitle : 'Coming Next',
                    duration_estimate: lesson.minutes,
                    thumbnail_image: '/assets/dr-leverage-transmission.png',
                    playback_status: 'ready' as const,
                    external_resource_url: externalResourceUrl,
                    external_resource_title: externalResourceTitle
                }
            };
        })
    }))
};
