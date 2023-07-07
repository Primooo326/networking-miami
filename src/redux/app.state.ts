import { ActionReducerMap } from "@ngrx/store";
import { INotificacion, Usuario } from "src/app/tools/models";
import { userReducer, notificationReducer, pendingMatchesReducer, requestMatchesReducer,matchesReducer } from "./reducers";



export interface AppState {
  user: Usuario;
  notifications: INotificacion[];
  pendingMatches: any;
  requestMatches: any;
  matches: any;
}

export const ROOT_REDUCERS:ActionReducerMap<AppState> = {
  user: userReducer,
  notifications: notificationReducer,
  pendingMatches: pendingMatchesReducer,
  requestMatches: requestMatchesReducer,
  matches: matchesReducer
}
