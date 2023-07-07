import { ActionReducerMap } from "@ngrx/store";
import { INotificacion, Usuario } from "src/app/tools/models";
import { userReducer, notificationReducer, pendingMatchesReducer, requestMatchesReducer } from "./reducers";



export interface AppState {
  user: Usuario;
  notifications: INotificacion[];
  pendingMatches: any;
  requestMatches: any;
}

export const ROOT_REDUCERS:ActionReducerMap<AppState> = {
  user: userReducer,
  notifications: notificationReducer,
  pendingMatches: pendingMatchesReducer,
  requestMatches: requestMatchesReducer
}
