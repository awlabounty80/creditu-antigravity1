const accounts = [
    { type: 'Credit Card', name: 'Chase Sapphire Preferred', balance: 1250, limit: 15000, status: 'Current' },
    { type: 'Auto Loan', name: 'Toyota Financial Services', balance: 14200, limit: 25000, status: 'Current' },
    { type: 'Credit Card', name: 'Amex Gold', balance: 450, limit: 10000, status: 'Current' },
    { type: 'Student Loan', name: 'Navient', balance: 8500, limit: 12000, status: 'Deferred' }
];

export default function handler(req: any, res: any) {
    res.status(200).json(accounts);
}
