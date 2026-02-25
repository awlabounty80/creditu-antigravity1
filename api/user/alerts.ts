const alerts = [
    { type: 'warning', title: 'New Credit Inquiry', date: '2 days ago', description: 'A new credit inquiry was detected from CHASE BANK USA.' },
    { type: 'success', title: 'Credit Score Increased', date: '1 week ago', description: 'Congratulations! Your score increased by 12 points.' },
    { type: 'danger', title: 'Suspicious Activity Detected', date: '2 weeks ago', description: 'Unusual spending pattern detected on your Amex Gold card.' }
];

export default function handler(req: any, res: any) {
    res.status(200).json(alerts);
}
