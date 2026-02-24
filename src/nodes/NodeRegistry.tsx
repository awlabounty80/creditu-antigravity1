import React from 'react';

export interface NodeMetadata {
    id: string;
    name: string;
    purpose: string;
    route: string;
    component: React.LazyExoticComponent<any>;
    permissions: string[];
    featureFlag: string;
    icon?: string;
}

// Lazy load nodes for modularity and performance
export const NODES: NodeMetadata[] = [
    {
        id: 'labs',
        name: 'Innovation Labs',
        purpose: 'The central hub for all experimental Credit U infrastructure nodes.',
        route: '/dashboard/labs',
        component: React.lazy(() => import('@/nodes/LabsLauncher')),
        permissions: ['student', 'founder'],
        featureFlag: 'NODE_LABS'
    },
    {
        id: 'dorm-hub',
        name: 'Dorm Week Hub',
        purpose: 'Central orientation and protocol management center.',
        route: '/dashboard/labs/dorm-hub',
        component: React.lazy(() => import('@/nodes/DormWeekHub/DormWeekHub')),
        permissions: ['student', 'founder'],
        featureFlag: 'NODE_DORM_HUB'
    },
    {
        id: 'visibility-lab',
        name: 'Funding Visibility Lab',
        purpose: 'Real-time analysis of your digital footprint for funding approval.',
        route: '/dashboard/labs/visibility',
        component: React.lazy(() => import('@/nodes/VisibilityLab/VisibilityLab')),
        permissions: ['student', 'founder'],
        featureFlag: 'NODE_VISIBILITY_LAB'
    },
    {
        id: 'loan-beast',
        name: 'Student Loan Beast',
        purpose: 'Student debt mitigation and consolidation strategies.',
        route: '/dashboard/labs/student-loans',
        component: React.lazy(() => import('@/nodes/StudentLoanBeast/StudentLoanBeast')),
        permissions: ['student', 'founder'],
        featureFlag: 'NODE_LOAN_BEAST'
    },
    {
        id: 'monitoring-guide',
        name: 'Credit Monitoring Explainer',
        purpose: 'Personalized breakdown of report changes and trends.',
        route: '/dashboard/labs/monitoring-guide',
        component: React.lazy(() => import('@/nodes/CreditMonitoringGuide/CreditMonitoringGuide')),
        permissions: ['student', 'founder'],
        featureFlag: 'NODE_MONITORING_GUIDE'
    },
    {
        id: 'dispute-lab',
        name: 'Dispute Lab (Advanced)',
        purpose: 'Next-gen letter builder with consumer law citations.',
        route: '/dashboard/labs/dispute-lab',
        component: React.lazy(() => import('@/nodes/DisputeLab/DisputeLab')),
        permissions: ['student', 'founder'],
        featureFlag: 'NODE_DISPUTE_LAB'
    },
    {
        id: 'budget-paydown',
        name: 'Budget + Paydown Accelerator',
        purpose: 'Income-based debt eradication sequences.',
        route: '/dashboard/labs/budget-paydown',
        component: React.lazy(() => import('@/nodes/BudgetPaydown/BudgetPaydown')),
        permissions: ['student', 'founder'],
        featureFlag: 'NODE_BUDGET_PAYDOWN'
    },
    {
        id: 'dorm-pre-reg',
        name: 'Dorm Pre-Registration',
        purpose: 'Initial intake for the incoming class.',
        route: '/pre-reg',
        component: React.lazy(() => import('@/nodes/DormWeekPreReg/DormWeekPreReg')),
        permissions: ['public', 'student', 'founder'],
        featureFlag: 'NODE_DORM_PRE_REG'
    }
];

export const getRegistryState = () => {
    // Check localStorage or feature flag service
    const flags = JSON.parse(localStorage.getItem('creditu_feature_flags') || '{}');
    return NODES.filter(node => flags[node.featureFlag] === true || flags['ALL_NODES'] === true);
};
