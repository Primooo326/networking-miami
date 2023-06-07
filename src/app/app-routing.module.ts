import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LoginComponent } from "./pages/login/login.component"
import { LandingpageComponent } from "./pages/landingpage/landingpage.component"
import { HomeComponent } from "./pages/home/home.component"
import { auth } from "./services/guard.guard"

const routes: Routes = [
	{ path: "", component: LandingpageComponent },
	{ path: "login", component: LoginComponent },
	{ path: "home", component: HomeComponent, canActivate: [auth] },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
