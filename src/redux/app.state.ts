import { ActionReducerMap } from "@ngrx/store";
import { INotificacion, Usuario } from "src/app/tools/models";
import { userReducer, notificationReducer, matchRequestReducer } from "./reducers";



export interface AppState {
  user: Usuario;
  notifications: INotificacion[];
  matchRequest: any;
}

export const ROOT_REDUCERS:ActionReducerMap<AppState> = {
  user: userReducer,
  notifications: notificationReducer,
  matchRequest: matchRequestReducer
}
