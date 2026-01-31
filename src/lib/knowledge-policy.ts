/**
 * CREDIT U™ KNOWLEDGE INGESTION & CONTENT MANUFACTURING POLICY
 * PROTOCOL: KI-Normalization-Alpha
 */

export const SOURCE_CATEGORIES = {
    CREDIT_BUREAUS: {
        id: 'I',
        name: 'Credit Bureaus (Authoritative)',
        allowed_domains: ['experian.com', 'equifax.com', 'transunion.com'],
        usage: ['Scoring logic', 'Factors', 'Report structure', 'Dispute rules']
    },
    SCORING_MODELS: {
        id: 'II',
        name: 'Scoring Models & Standards',
        allowed_domains: ['fico.com', 'myfico.com', 'consumerfinance.gov'],
        usage: ['Score ranges', 'Risk modeling concepts']
    },
    FEDERAL_LAW: {
        id: 'III',
        name: 'U.S. Federal Law & Regulation',
        allowed_domains: ['consumerfinance.gov', 'ftc.gov', 'justice.gov', 'federalreserve.gov', 'govinfo.gov'],
        usage: ['Legal accuracy', 'Compliance', 'FCRA', 'FDCPA', 'ECOA', 'TILA']
    },
    BANKING_SYSTEMS: {
        id: 'IV',
        name: 'Banking & Financial Systems',
        allowed_domains: ['federalreserve.gov', 'frbservices.org', 'nacha.org', 'usbanklocations.com'],
        usage: ['ACH', 'Checking', 'Risk logic']
    },
    LENDING_STANDARDS: {
        id: 'V',
        name: 'Mortgage, Auto & Loan Standards',
        allowed_domains: ['hud.gov', 'fanniemae.com', 'freddiemac.com', 'va.gov', 'consumerfinance.gov'],
        usage: ['Loan qualification', 'DTI', 'Down payments']
    },
    BUSINESS_ENTITY: {
        id: 'VI',
        name: 'Business Credit & Entity Structure',
        allowed_domains: ['irs.gov', 'sba.gov', 'dnb.com', 'experian.com/business', 'equifax.com/business'],
        usage: ['EIN', 'Business Bureaus', 'Trade lines']
    },
    TAX_INCOME: {
        id: 'VII',
        name: 'Tax & Income Education',
        allowed_domains: ['irs.gov', 'taxpayeradvocate.irs.gov', 'ssa.gov', 'bls.gov'],
        usage: ['Income types', 'Tax concepts', 'Withholding']
    },
    EDUCATION_LITERACY: {
        id: 'VIII',
        name: 'Education & Financial Literacy (Non-Commercial)',
        allowed_domains: ['khanacademy.org', 'ed.gov', 'nces.ed.gov', 'open.edu'],
        usage: ['Curriculum standards', 'Assessment design']
    },
    DATA_ECONOMICS: {
        id: 'IX',
        name: 'Data, Statistics & Economic Context',
        allowed_domains: ['bls.gov', 'census.gov', 'fred.stlouisfed.org', 'bea.gov'],
        usage: ['Benchmarks', 'Averages', 'Trends']
    },
    OER: {
        id: 'X',
        name: 'Open Educational Resources',
        allowed_domains: ['oercommons.org', 'openstax.org', 'creativecommons.org'],
        usage: ['Frameworks', 'Concepts']
    }
}

export const CORE_RULES = [
    "Do NOT pull from influencer blogs, opinion pieces, or marketing sites.",
    "Do NOT invent facts, laws, or thresholds.",
    "Do NOT copy proprietary content verbatim.",
    "Do NOT rely on a single source for any financial rule.",
    "Always cross-check across at least two authoritative sources."
]

export const VALID_OUTPUT_FORMATS = [
    'KNOWLEDGE_BASE_ARTICLE',
    'QUIZ',
    'VIDEO_SCRIPT',
    'TOOL_LOGIC_DESCRIPTION',
    'CALCULATOR_EXPLANATION',
    'GLOSSARY_ENTRY',
    'VISUAL_METAPHOR_OUTLINE'
]

export const SAFETY_CHECKLIST = [
    "Legal accuracy confirmed",
    "Source cross-verified",
    "No proprietary copying",
    "No promises, guarantees, or credit repair advice",
    "No individualized financial advice"
]
