import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "./services/guards/auth.guard"
import { LandingGuard } from "./services/guards/landing.guard"

const routes: Routes = [
	{
		path: "login",
		loadChildren: () =>
			import("./pages/login/login.module").then((m) => m.LoginModule),
		canActivate: [LandingGuard],
	},
	{
		path: "home",
		loadChildren: () =>
			import("./pages/home/home.module").then((m) => m.HomeModule),
		canActivate: [AuthGuard],
	},
	{
		path: "profile-settings",
		loadChildren: () =>
			import("./pages/settings/settings.module").then((m) => m.SettingsModule),
		canActivate: [AuthGuard],
	},
	{
		path: "user/:id",
		canActivate: [AuthGuard],
		loadChildren: () =>
			import("./pages/user/user.module").then((m) => m.UserModule),
	},
	{
		path: "match",
		loadChildren: () =>
			import("./pages/matches/matches.module").then((m) => m.MatchesModule),
		canActivate: [AuthGuard],
	},
	{
		path: "**",
		redirectTo: "",
	},
	{
		path: "",
		loadChildren: () =>
			import("./pages/landing/landing.module").then((m) => m.LandingModule),
		pathMatch: "full",
		canActivate: [LandingGuard],
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
