/**
 * CREDIT U: CENTRALIZED PERMISSION ENGINE
 * 
 * Rules:
 * 1. Admin/Dean bypass academic levels.
 * 2. Professors bypass academic levels for curriculum review ONLY.
 * 3. Professor still respects premium/internal/admin tool blocks unless specifically granted.
 * 4. Academic Rank: foundation < freshman < sophomore < junior < senior < graduate
 */

export type Role = 'student' | 'professor' | 'admin' | 'dean';
export type AcademicLevel = 'foundation' | 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';
export type SubscriptionTier = 'free' | 'premium';

export const ACADEMIC_RANKS: Record<AcademicLevel, number> = {
    'foundation': 0,
    'freshman': 1,
    'sophomore': 2,
    'junior': 3,
    'senior': 4,
    'graduate': 5
};

/**
 * Checks if a user has sufficient academic rank to access content.
 * @param isCurriculum - If true, professors bypass the check (curriculum review flow).
 */
export function hasAcademicAccess(
    userRole: Role,
    userLevel: AcademicLevel,
    requiredLevel: AcademicLevel,
    isCurriculum: boolean = false
): boolean {
    // Admin and Dean bypass all academic gates
    if (userRole === 'admin' || userRole === 'dean') return true;

    // Professors bypass academic levels ONLY for curriculum review/testing flows
    if (userRole === 'professor' && isCurriculum) return true;

    // Student (and Professor in non-curriculum flows) must meet or exceed the required rank
    return ACADEMIC_RANKS[userLevel] >= ACADEMIC_RANKS[requiredLevel];
}

/**
 * Checks if a user has sufficient subscription tier (Free vs Premium).
 */
export function hasPremiumAccess(
    userRole: Role,
    userTier: SubscriptionTier | undefined
): boolean {
    // Admin and Dean bypass premium requirements
    if (userRole === 'admin' || userRole === 'dean') return true;
    
    // Professors do NOT receive a blanket bypass for premium-only content
    return userTier === 'premium';
}

/**
 * Checks if a user has specific tool permissions (Feature Flags).
 * Used for tools like Dispute Wizard.
 */
export function hasToolAccess(
    userRole: Role,
    featureFlags: Record<string, boolean>,
    requiredFlag: string
): boolean {
    // Admin and Dean bypass tool restrictions
    if (userRole === 'admin' || userRole === 'dean') return true;
    
    // Check if the specific flag is enabled
    return featureFlags[requiredFlag] === true || featureFlags['ALL_NODES'] === true;
}
