import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { HeaderComponent } from "./header/header.component"
import { FooterComponent } from "./footer/footer.component"
import { Auth0Component } from "./auth0/auth0.component"
import { RouterModule } from "@angular/router"
import { ProfileCardComponent } from "./profile-card/profile-card.component"
import { BannerComponent } from "./banner/banner.component"
import { ToolsModule } from "../tools/tools.module";
import { ToastComponent } from './toast/toast.component'

@NgModule({
	declarations: [
		HeaderComponent,
		FooterComponent,
		Auth0Component,
		ProfileCardComponent,
		BannerComponent,
  ToastComponent,
	],
	imports: [CommonModule, RouterModule, ToolsModule],
	exports: [
		HeaderComponent,
		FooterComponent,
		Auth0Component,
		ProfileCardComponent,
		BannerComponent,
    ToastComponent
	],
})
export class ComponentsModule {}
