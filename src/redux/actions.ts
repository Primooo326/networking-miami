import { createActionGroup, emptyProps } from "@ngrx/store"
import { INotificacion, Usuario } from "../app/tools/models"

export const setUser = createActionGroup({
	source: "[User] Set Current User",
	events: {
		set: (user: Usuario) => ({ user }),
    verifyEmail:(data:any) => (data)
  }
})
export const newNotification = createActionGroup({
	source: "[Sistem] New Notification",

	events: {
		set: (notification: INotificacion) => ({ notification }),
		delete: (notification: INotificacion) => ({ notification }),
	},
})
export const newPendingMatch = createActionGroup({
	source: "[Sistem] Match Request",
	events: {
		set: (pendingMatch: any) => ({ matchRequest: pendingMatch }),
		delete: (cancelMatch: any) => ({ cancelMatch }),
	},
})
export const myRequestMatches = createActionGroup({
	source: "[Sistem] My Request Matches",
	events: {
		set: (requestMatches: any) => ({ requestMatches }),
		delete: (cancelRequestMatch: any) => ({ cancelRequestMatch }),
	},
})

export const myMatches = createActionGroup({
	source: "[Sistem] My Matches",
	events: {
		set: (matches: any) => ({ matches }),
		delete: (cancelMatch: any) => ({ cancelMatch }),
	},
})
export const myMessages = createActionGroup({
	source: "[Sistem] My Messages",
	events: {
		set: (messages: any) => ({ messages }),
		update: (message: any) => ({ message }),
	},
})
