import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "./header/header.component"
import { FooterComponent } from "./footer/footer.component"
import { Auth0Component } from "./auth0/auth0.component"
import { RouterModule } from "@angular/router"
import { ProfileCardComponent } from "./profile-card/profile-card.component"
import { BannerComponent } from "./banner/banner.component"
import { ToolsModule } from "../tools/tools.module"
import { ToastComponent } from "./toast/toast.component"
import { ChatModalComponent } from "./chat-modal/chat-modal.component"
import { ReactiveFormsModule } from "@angular/forms"
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
		HeaderComponent,
		FooterComponent,
		Auth0Component,
		ProfileCardComponent,
		BannerComponent,
		ToastComponent,
		ChatModalComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		ToolsModule,
		ReactiveFormsModule,
		FilePondModule,
	],
	exports: [
		HeaderComponent,
		FooterComponent,
		Auth0Component,
		ProfileCardComponent,
		BannerComponent,
		ToastComponent,
		ChatModalComponent,
	],
})
export class ComponentsModule {}
