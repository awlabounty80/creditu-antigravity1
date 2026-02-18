import * as pdfjsLib from 'pdfjs-dist';
// Explicitly import the worker to ensure it's bundled
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ParsedAccount {
    id: string;
    creditorName: string;
    accountNumber: string;
    status: string;
    balance: string;
    openedDate: string;
    bureau: 'Equifax' | 'Experian' | 'TransUnion' | 'Unknown';
}

export interface CreditReportData {
    rawText: string;
    accounts: ParsedAccount[];
    reportDate: string;
    score?: string;
}

// Regex Patterns for Common Credit Report Formats (IdentityIQ, SmartCredit, etc.)
const PATTERNS = {
    accountNumber: /(?:Account\s*#|Acct\s*#|Account\s*Number)[:\s]*([X0-9\-]+)/i,
    balance: /(?:Balance|Current\s*Balance)[:\s]*\$?([\d,]+\.?\d*)/i,
    status: /(?:Account\s*Status|Status)[:\s]*([A-Za-z\s\/]+)/i,
    openedDate: /(?:Date\s*Opened|Opened)[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,
    bureauScores: /(?:Experian|Equifax|TransUnion)\s*[:\-]?\s*(\d{3})/i
};

export async function parseCreditReport(file: File): Promise<CreditReportData> {
    const arrayBuffer = await file.arrayBuffer();

    try {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        const accounts: ParsedAccount[] = [];

        // 1. Extract Text
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // Join with newlines to preserve vertical structure
            const pageText = textContent.items.map((item: any) => item.str).join('\n');
            fullText += pageText + '\n';
        }

        const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // 2. Parser State Machine
        let currentAccount: Partial<ParsedAccount> | null = null;
        let bufferCount = 0; // To detect end of account block

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Heuristic: Start of new account often looks like specific keywords usually found in headers
            // OR identifying a line that is NOT a key-value pair but looks like a Creditor Name (All Caps)
            // This is tricky without strict structure. We'll use "Account #" as an anchor.

            const acctMatch = line.match(PATTERNS.accountNumber);
            if (acctMatch) {
                // If we found a new account number, save the previous one if valid
                if (currentAccount && currentAccount.creditorName && currentAccount.accountNumber) {
                    // Enrich with ID and push
                    accounts.push(finalizeAccount(currentAccount));
                }

                // Start new account context
                // Look backwards for Creditor Name (usually 1-3 lines above Account #)
                let creditorName = "Unknown Creditor";
                if (i > 0 && isPotentialCreditor(lines[i - 1])) creditorName = lines[i - 1];
                else if (i > 1 && isPotentialCreditor(lines[i - 2])) creditorName = lines[i - 2];

                currentAccount = {
                    creditorName: creditorName,
                    accountNumber: acctMatch[1],
                    bureau: 'Unknown' // Complex to determine from text stream without positional data
                };
                continue;
            }

            if (currentAccount) {
                // We are inside an account block, parse details
                const balMatch = line.match(PATTERNS.balance);
                if (balMatch && !currentAccount.balance) currentAccount.balance = balMatch[1];

                const statusMatch = line.match(PATTERNS.status);
                if (statusMatch && !currentAccount.status) currentAccount.status = statusMatch[1].trim();

                const openMatch = line.match(PATTERNS.openedDate);
                if (openMatch && !currentAccount.openedDate) currentAccount.openedDate = openMatch[1];

                // Heuristic: If we hit a "Report Date" or strictly irrelevant section, might close block.
                // For now, we rely on the next "Account #" or end of loop to close.
            }
        }

        // Push last account
        if (currentAccount && currentAccount.creditorName) {
            accounts.push(finalizeAccount(currentAccount));
        }

        console.log(`Parsed ${accounts.length} accounts.`);

        return {
            rawText: fullText,
            accounts: accounts,
            reportDate: new Date().toISOString()
        };

    } catch (error) {
        console.error("PDF Parse Error:", error);
        return {
            rawText: "Error parsing PDF",
            accounts: [],
            reportDate: new Date().toISOString()
        };
    }
}

// Helpers
function finalizeAccount(partial: Partial<ParsedAccount>): ParsedAccount {
    return {
        id: Math.random().toString(36).substr(2, 9),
        creditorName: partial.creditorName || "Unknown",
        accountNumber: partial.accountNumber || "Wait...",
        status: partial.status || "Unknown",
        balance: partial.balance ? `$${partial.balance}` : "$0",
        openedDate: partial.openedDate || "N/A",
        bureau: partial.bureau || 'Unknown'
    };
}

function isPotentialCreditor(line: string): boolean {
    // Basic heuristic: Uppercase, not too long, not a known label
    if (line.length < 3 || line.length > 50) return false;
    if (line.includes("Account") || line.includes("Date") || line.includes("Balance")) return false;
    // Check if mostly uppercase (allow some symbols like &)
    const upperCount = line.replace(/[^A-Z]/g, "").length;
    const totalCount = line.replace(/[^A-Za-z]/g, "").length;
    return (upperCount / (totalCount || 1)) > 0.8;
}
