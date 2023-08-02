import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeArray'
})
export class PipearrayPipe implements PipeTransform {

  transform(value: Array<string>, args?: string): unknown {
    return value.join(', ');
  }

}
