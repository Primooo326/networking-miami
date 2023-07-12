import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LoginComponent } from "./pages/login/login.component"
import { LandingpageComponent } from "./pages/landingpage/landingpage.component"
import { HomeComponent } from "./pages/home/home.component"
import { ProfileSettingsComponent } from "./pages/profile-settings/profile-settings.component"
import { MatchesComponent } from "./pages/matches/matches.component"
import { AuthGuard } from "./services/guards/auth.guard"
import { LandingGuard } from "./services/guards/landing.guard"
import { UserComponent } from "./pages/user/user.component"

const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "home", component: HomeComponent, canActivate:[AuthGuard] },
	{ path: "profile-settings", component: ProfileSettingsComponent, canActivate:[AuthGuard] },
  { path: "user", component: UserComponent },
	{ path: "match", component: MatchesComponent, canActivate:[AuthGuard] },
	{ path: "**", redirectTo: "" },
	{ path: "", component: LandingpageComponent, pathMatch: "full", canActivate:[LandingGuard] },
]

@NgModule({
	imports: [RouterModule.forRoot(routes, { enableTracing: false })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
