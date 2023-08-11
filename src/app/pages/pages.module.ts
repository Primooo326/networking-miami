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
import { UserComponent } from "./user/user.component"
import { FilePondModule, registerPlugin } from "ngx-filepond"

// import and register filepond file type validation plugin
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
// Import the plugin code
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import FilePondPluginImageResize from "filepond-plugin-image-resize"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
registerPlugin(
	FilePondPluginFileValidateType,
	FilePondPluginImagePreview,
	FilePondPluginImageResize,
	FilePondPluginImageExifOrientation,
)
@NgModule({
	declarations: [
		LoginComponent,
		LandingpageComponent,
		HomeComponent,
		ProfileSettingsComponent,
		MatchesComponent,
		UserComponent,
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		ComponentsModule,
		ToolsModule,
		FilePondModule,
	],
})
export class PagesModule {}
