import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { PipearrayPipe } from "./pipearray.pipe"

@NgModule({
	declarations: [PipearrayPipe],
	imports: [CommonModule],
	exports: [PipearrayPipe],
})
export class ToolsModule {}
