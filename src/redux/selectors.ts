import { AppState } from "./app.state";

export const userSelect = (state:AppState) => state.user;
export const notificationSelect = (state:AppState) => state.notifications;
export const matchRequestSelect = (state:AppState) => state.matchRequest;
