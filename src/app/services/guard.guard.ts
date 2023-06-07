import { CanActivateFn, Router, UrlTree } from "@angular/router"

export const auth: CanActivateFn = (route, state) => {
	console.log(route, state)
	const router = new Router()
	if (localStorage.getItem("session")) {
		const { token, user } = JSON.parse(localStorage.getItem("session")!)
		console.log(token, user)
		return true
	} else {
		return false
	}
}
