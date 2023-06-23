import { createActionGroup } from "@ngrx/store";
import { Usuario } from '../app/tools/models';



export const setUser = createActionGroup({
  source:"[User] Set Current User",
  events:{
    set: (user:Usuario) => ({user})
  }
})
