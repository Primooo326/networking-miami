import { createActionGroup } from "@ngrx/store";
import { INotificacion, Usuario } from '../app/tools/models';



export const setUser = createActionGroup({
  source:"[User] Set Current User",
  events:{
    set: (user:Usuario) => ({user})
  }
})
export const newNotification = createActionGroup({
  source:"[Sistem] New Notification",

  events:{
    set: (notification:INotificacion) => ({notification})
  }
})
export const newMatchRequest = createActionGroup({
  source:"[Sistem] Match Request",
  events:{
    set: (matchRequest:any) => ({matchRequest})

  }
})
