/**
 * Student ID Generator for Credit University
 * Format: CU-{YEAR}-{SEMESTER}-{RANDOM}
 * Example: CU-2026-FA-8X92
 */

export function generateStudentId(): string {
    const year = new Date().getFullYear();
    const semester = getSemester();
    const randomBlock = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `CU-${year}-${semester}-${randomBlock}`;
}

function getSemester(): string {
    const month = new Date().getMonth();
    if (month >= 0 && month <= 4) return 'SP'; // Spring
    if (month >= 5 && month <= 7) return 'SU'; // Summer
    return 'FA'; // Fall
}
