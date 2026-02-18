import { supabase } from '@/lib/supabase'

export interface ChatMessage {
    id: string
    user_id: string
    user_name: string
    avatar_url: string
    message: string
    created_at: string
    role: string
}

export interface StreamConfig {
    id: string
    is_live: boolean
    stream_url: string | null
    title: string
    viewer_count: number
}

class LiveStreamService {
    // Subscribe to chat messages for a specific room
    subscribeToChat(roomId: string, onMessage: (msg: ChatMessage) => void) {
        return supabase
            .channel(`chat:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `room_id=eq.${roomId}`
                },
                (payload) => {
                    const msg = payload.new as ChatMessage
                    onMessage(msg)
                }
            )
            .subscribe()
    }

    // Send a message
    async sendMessage(roomId: string, message: string, user: any) {
        const { error } = await supabase
            .from('chat_messages')
            .insert({
                room_id: roomId,
                user_id: user.id,
                user_name: user.full_name || 'Anonymous',
                avatar_url: user.avatar_url,
                message: message,
                role: user.role || 'student'
            })

        if (error) console.error('Error sending message:', error)
        return error
    }

    // Subscribe to stream status updates
    subscribeToStream(roomId: string, onUpdate: (config: StreamConfig) => void) {
        return supabase
            .channel(`stream:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'streams',
                    filter: `id=eq.${roomId}`
                },
                (payload) => {
                    onUpdate(payload.new as StreamConfig)
                }
            )
            .subscribe()
    }

    // Get initial stream state
    async getStreamState(roomId: string): Promise<StreamConfig | null> {
        const { data } = await supabase
            .from('streams')
            .select('*')
            .eq('id', roomId)
            .single()

        return data
    }

    // Update stream state (Admin only)
    async updateStream(roomId: string, updates: Partial<StreamConfig>) {
        const { error } = await supabase
            .from('streams')
            .update(updates)
            .eq('id', roomId)

        return error
    }

    // Fetch initial chat history
    async getChatHistory(roomId: string): Promise<ChatMessage[]> {
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true })
            .limit(50)

        return (data as ChatMessage[]) || []
    }
}

export const liveStreamService = new LiveStreamService()
