import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LoginComponent } from "./login/login.component"
import { LandingpageComponent } from "./landingpage/landingpage.component"
import { HomeComponent } from "./home/home.component"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { ComponentsModule } from "../components/components.module"
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component"
import { MatchesComponent } from "./matches/matches.component"
import { ToolsModule } from "../tools/tools.module"

@NgModule({
	declarations: [
		LoginComponent,
		LandingpageComponent,
		HomeComponent,
		ProfileSettingsComponent,
		MatchesComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		ComponentsModule,
		ToolsModule,
	],
})
export class PagesModule {}
