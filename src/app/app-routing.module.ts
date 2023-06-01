import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { LandingpageComponent } from "./pages/landingpage/landingpage.component";

const routes: Routes = [
	{ path: "", component: LandingpageComponent },
	{ path: "login", component: LoginComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
