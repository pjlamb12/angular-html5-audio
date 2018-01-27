import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'trackTimeDisplay',
})
export class TrackTimeDisplayPipe implements PipeTransform {
	transform(value: any, args?: any): any {
		if (!value) {
			return '0:00';
		}
		const minutes = Math.floor(value / 60);
		const minutesInSeconds = minutes * 60;
		const remainingSeconds = '0' + (value - minutesInSeconds);
		const remainingDisplay = remainingSeconds.substr(remainingSeconds.length - 2);
		return `${Math.floor(value / 60)}:${remainingDisplay}`;
	}
}
