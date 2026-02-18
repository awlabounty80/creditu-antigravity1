import { useLocation } from 'react-router-dom';
import { useProfile } from './useProfile'; // Assuming this exists as seen in useGamification
import {
    PageId,
    getAmaraGuidance,
    AmaraGuidance,
    PageContext
} from '@/lib/amara-knowledge-maps';

export function useAmaraBrain(): AmaraGuidance | null {
    const location = useLocation();
    const { profile } = useProfile();

    const path = location.pathname;

    // 1. Map URL to Page Brain ID
    let pageId: PageId = 'unknown';

    if (path === '/dashboard' || path === '/dashboard/') {
        pageId = 'home_dashboard';
    } else if (path.includes('/dashboard/credit-lab')) {
        pageId = 'credit_lab';
    } else if (path.includes('/dashboard/tools') || path.includes('/dashboard/simulator')) {
        pageId = 'credit_tools';
    } else if (path.includes('/dashboard/course') || path.includes('/dashboard/curriculum') || path.includes('/dashboard/class')) {
        pageId = 'courses_lessons';
    } else if (path.includes('/dashboard/store')) {
        pageId = 'vending_machine';
    } else if (path.includes('/dashboard/settings')) {
        pageId = 'profile_settings';
    } else if (path.includes('/dashboard/vision') || path.includes('/dashboard/learning-path')) {
        // Fallback for visual roadmap pages
        pageId = 'membership_levels';
    }

    // 2. Build the Context
    const context: PageContext = {
        pageId,
        userName: profile?.first_name || 'Student', // Assuming profile has first_name
        // In the future, we can wire up timeOnPage, etc.
    };

    // 3. Get the Brain's Guidance
    const guidance = getAmaraGuidance(context);

    // Only return guidance if we are actually on a mapped page (optional check)
    return guidance;
}
