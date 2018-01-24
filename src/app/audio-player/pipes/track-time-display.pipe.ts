import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'trackTimeDisplay',
})
export class TrackTimeDisplayPipe implements PipeTransform {
	transform(value: any, args?: any): any {
		if (!value) {
			return 0;
		}
		return value;
	}
}
