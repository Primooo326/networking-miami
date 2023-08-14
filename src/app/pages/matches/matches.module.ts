import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"

import { MatchesRoutingModule } from "./matches-routing.module"
import { MatchesComponent } from "./matches.component"
import { ComponentsModule } from "src/app/components/components.module"

@NgModule({
	declarations: [MatchesComponent],
	imports: [CommonModule, MatchesRoutingModule, ComponentsModule],
})
export class MatchesModule {}
