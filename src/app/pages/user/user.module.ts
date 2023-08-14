import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"

import { UserRoutingModule } from "./user-routing.module"
import { UserComponent } from "./user.component"
import { ToolsModule } from "src/app/tools/tools.module"
import { ComponentsModule } from "src/app/components/components.module"

@NgModule({
	declarations: [UserComponent],
	imports: [CommonModule, UserRoutingModule, ToolsModule, ComponentsModule],
})
export class UserModule {}
