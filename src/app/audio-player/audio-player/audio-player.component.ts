import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'audio-player',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
	@Input() audioSrc: string;
	@ViewChild('audioPlayer') audioPlayer: ElementRef;
	public trackLength: number = 0;
	constructor(private changeDetectorRef: ChangeDetectorRef) {}

	ngOnInit() {}

	ngAfterViewInit() {
		this.audioPlayer.nativeElement.addEventListener('canplaythrough', this.setTrackLength.bind(this));
	}

	setTrackLength() {
		this.trackLength = Math.ceil(this.audioPlayer.nativeElement.duration);
		this.changeDetectorRef.detectChanges();
	}
}
