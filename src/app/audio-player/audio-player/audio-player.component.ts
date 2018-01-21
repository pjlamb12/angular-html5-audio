import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AudioPlayerConfig } from '../audio-player-config';

@Component({
	selector: 'audio-player',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
	@Input() audioSrc: string;
	@Input() config: AudioPlayerConfig;
	@ViewChild('audioPlayer') audioPlayer: ElementRef;
	@ViewChild('playhead') playhead: ElementRef;
	public trackLength: number = 0;
	public isPlaying: boolean = false;
	public isReadyForPlayback = false;
	public currentTimeDisplay: number = 0;
	public playheadPosition: number = 0;

	constructor(private changeDetectorRef: ChangeDetectorRef) {}

	ngOnInit() {
		this.config = {
			timelineConfig: {
				timelineColor: '#333333',
				timelineHeight: 4,
				playheadHeight: 12,
				playheadColor: 'lightblue',
				opacity: '0.6',
			},
			playPauseConfig: {
				iconClassPrefix: 'fa',
				iconPixelSize: 18,
				pauseIconClass: 'fa-pause',
				pauseIconColor: '#333333',
				playIconClass: 'fa-play',
				playIconColor: '#333333',
			},
		};
	}

	ngAfterViewInit() {
		this.audioPlayer.nativeElement.addEventListener('canplaythrough', this.canPlayThrough.bind(this));
		this.audioPlayer.nativeElement.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
	}

	onTimeUpdate() {
		const currentTime = this.audioPlayer.nativeElement.currentTime;
		const playPercentAsDecimal = currentTime / this.trackLength;
		const currentTimeCeil = Math.ceil(currentTime);
		this.setCurrentTimeDisplay(currentTimeCeil);
		if (playPercentAsDecimal >= 1) {
			this.reset();
		} else {
			this.setPlayheadPosition(playPercentAsDecimal);
		}
		this.changeDetectorRef.detectChanges();
	}

	reset() {
		this.isPlaying = false;
		this.setPlayheadPosition(0);
		this.setCurrentTimeDisplay(0);
	}

	setPlayheadPosition(percent: number) {
		this.playheadPosition = 100 * percent;
	}

	setCurrentTimeDisplay(time: number) {
		this.currentTimeDisplay = time;
	}

	movePlayhead() {}

	canPlayThrough() {
		this.isReadyForPlayback = true;
		this.setTrackLength();
	}

	setTrackLength() {
		this.trackLength = Math.ceil(this.audioPlayer.nativeElement.duration);
		this.changeDetectorRef.detectChanges();
	}

	play() {
		if (!this.isPlaying) {
			this.audioPlayer.nativeElement.play();
			this.isPlaying = true;
		}
	}

	pause() {
		if (this.isPlaying) {
			this.audioPlayer.nativeElement.pause();
			this.isPlaying = false;
		}
	}
}
