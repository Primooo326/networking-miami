import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"

import { LoginRoutingModule } from "./login-routing.module"
import { LoginComponent } from "./login.component"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
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
	declarations: [LoginComponent],
	imports: [
		CommonModule,
		LoginRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		FilePondModule,
	],
})
export class LoginModule {}
