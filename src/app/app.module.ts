import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { ComponentsModule } from "./components/components.module"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { PagesModule } from "./pages/pages.module"
import { StoreModule } from "@ngrx/store"
import { ROOT_REDUCERS } from "src/redux/app.state"
// import filepond module
// import { FilePondModule, registerPlugin } from "ngx-filepond"

// import and register filepond file type validation plugin
// import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
// import * as FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
// registerPlugin(FilePondPluginFileValidateType)
@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		ReactiveFormsModule,
		//components module
		ComponentsModule,
		// FilePondModule, // add filepond module here
		// pages module
		PagesModule,
		AppRoutingModule,

		StoreModule.forRoot(ROOT_REDUCERS),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
