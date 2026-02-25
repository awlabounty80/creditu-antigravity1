export default function handler(req: any, res: any) {
    const { email } = req.body;
    const name = email ? email.split('@')[0] : 'User';
    const user = {
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        score: 768
    };

    res.status(200).json({ success: true, user });
}
