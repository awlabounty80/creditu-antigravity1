/**
 * Jules API Client
 * This client interacts with the Google Jules API to allow users to spawn coding agents
 * from within the Credit U application.
 * 
 * NOTE: Requires VITE_JULES_API_KEY in .env
 */

const JULES_API_ENDPOINT = "https://jules.googleapis.com/v1alpha";

export interface JulesSession {
    name: string;
    id: string;
    title: string;
    prompt: string;
    state?: string;
}

export interface JulesActivity {
    name: string;
    type: string;
    content?: string;
}

export class JulesClient {
    private apiKey: string;
    private source: string;

    constructor(apiKey: string, source: string) {
        this.apiKey = apiKey;
        this.source = source;
    }

    private async request(path: string, options: RequestInit = {}) {
        const headers = {
            "x-goog-api-key": this.apiKey,
            "Content-Type": "application/json",
            ...options.headers,
        };

        const response = await fetch(`${JULES_API_ENDPOINT}${path}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `Jules API Error: ${response.status}`);
        }

        return response.json();
    }

    async listSessions(pageSize = 5): Promise<JulesSession[]> {
        const data = await this.request(`/sessions?pageSize=${pageSize}`);
        return data.sessions || [];
    }

    async createSession(prompt: string, title: string = "New Task"): Promise<JulesSession> {
        // Find source first if not hardcoded? Use default for now.
        const body = {
            prompt,
            title,
            sourceContext: {
                source: this.source,
                githubRepoContext: {
                    startingBranch: "main"
                }
            },
            automationMode: "AUTO_CREATE_PR"
        };

        return this.request('/sessions', {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async getActivities(sessionId: string): Promise<JulesActivity[]> {
        const data = await this.request(`/sessions/${sessionId}/activities?pageSize=30`);
        return data.activities || [];
    }

    async sendMessage(sessionId: string, message: string): Promise<void> {
        await this.request(`/sessions/${sessionId}:sendMessage`, {
            method: 'POST',
            body: JSON.stringify({ prompt: message })
        });
    }
}

// Singleton instance helper
export const getJulesClient = () => {
    const key = import.meta.env.VITE_JULES_API_KEY;
    // Default source for Credit U repo - user would need to configure this matching their Jules setup
    const source = import.meta.env.VITE_JULES_SOURCE_ID || "sources/github/awlabounty80/creditu-antigravity1";

    if (!key) return null;
    return new JulesClient(key, source);
};
