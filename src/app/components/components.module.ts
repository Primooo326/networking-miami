import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { Auth0Component } from "./auth0/auth0.component";
import { RouterModule } from "@angular/router";
import { ProfileCardComponent } from './profile-card/profile-card.component';

@NgModule({
	declarations: [HeaderComponent, FooterComponent, Auth0Component, ProfileCardComponent],
	imports: [CommonModule, RouterModule],
	exports: [HeaderComponent, FooterComponent, Auth0Component, ProfileCardComponent],
})
export class ComponentsModule {}
