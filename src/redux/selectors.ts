import { AppState } from "./app.state"

export const userSelect = (state: AppState) => state.user
export const notificationSelect = (state: AppState) => state.notifications
export const matchPendingSelect = (state: AppState) => state.pendingMatches
export const matchRequestSelect = (state: AppState) => state.requestMatches
export const matchSelect = (state: AppState) => state.matches
export const messagesSelect = (state: AppState) => state.messages
