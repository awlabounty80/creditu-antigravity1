export const generateProtocolCalendar = (startDate: Date = new Date()) => {
    const events = [
        { day: 2, title: "Day 02 // The Interruption", desc: "Before spending, pause for 10 seconds. Ask: Survival, Comfort, or Strategy?" },
        { day: 3, title: "Day 03 // The Identity Shift", desc: "Choose one financial decision and delay it for 24 hours." },
        { day: 4, title: "Day 04 // The Rewire", desc: "Repeat 3x: I am safe while building." },
        { day: 5, title: "Day 05 // The Seal", desc: "Freshman Level Access Unlocks Today." }
    ];

    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Credit U//Financial Nervous System//EN',
        'CALSCALE:GREGORIAN'
    ];

    events.forEach((event, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (index + 1)); // Start from tomorrow (Day 2)
        date.setHours(8, 0, 0, 0); // 8 AM

        const end = new Date(date);
        end.setMinutes(15); // 15 min duration

        const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        icsContent.push(
            'BEGIN:VEVENT',
            `DTSTART:${formatDate(date)}`,
            `DTEND:${formatDate(end)}`,
            `SUMMARY:🕸 ${event.title}`,
            `DESCRIPTION:${event.desc}`,
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'TRIGGER:-PT15M',
            'ACTION:DISPLAY',
            'DESCRIPTION:Protocol Activation',
            'END:VALARM',
            'END:VEVENT'
        );
    });

    icsContent.push('END:VCALENDAR');

    // Create and Trigger Download
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'financial_nervous_system_protocol.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
