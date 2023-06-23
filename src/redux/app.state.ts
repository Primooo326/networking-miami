import { ActionReducerMap } from "@ngrx/store";
import { Usuario } from "src/app/tools/models";
import { userReducer } from "./reducers";



export interface AppState {
  user: Usuario;
}

export const ROOT_REDUCERS:ActionReducerMap<AppState> = {
  user: userReducer
}
