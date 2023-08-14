import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"

import { SettingsRoutingModule } from "./settings-routing.module"
import { SettingsComponent } from "./settings.component"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ComponentsModule } from "src/app/components/components.module"
import { ToolsModule } from "src/app/tools/tools.module"

@NgModule({
	declarations: [SettingsComponent],
	imports: [
		CommonModule,
		SettingsRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		ComponentsModule,
		ToolsModule,
	],
})
export class SettingsModule {}
