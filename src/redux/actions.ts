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
export const newPendingMatch = createActionGroup({
  source:"[Sistem] Match Request",
  events:{
    set: (pendingMatch:any) => ({matchRequest: pendingMatch})

  }
})
export const myRequestMatches = createActionGroup({
  source:"[Sistem] My Request Matches",
  events:{
    set: (requestMatches:any) => ({requestMatches}),
    delete: (cancelRequestMatch:any) => ({cancelRequestMatch})

  }
})

