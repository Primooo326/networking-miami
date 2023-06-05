import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { LandingpageComponent } from "./landingpage/landingpage.component";
import { HomeComponent } from "./home/home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [LoginComponent, LandingpageComponent, HomeComponent],
	imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class PagesModule {}
