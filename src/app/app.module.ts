import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { ComponentsModule } from "./components/components.module"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { StoreModule } from "@ngrx/store"
import { ROOT_REDUCERS } from "src/redux/app.state"
@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		ReactiveFormsModule,
		ComponentsModule,
		AppRoutingModule,
		StoreModule.forRoot(ROOT_REDUCERS),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
