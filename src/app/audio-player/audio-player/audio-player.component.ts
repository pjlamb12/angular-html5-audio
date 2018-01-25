import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AudioPlayerConfig } from '../audio-player-config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

@Component({
	selector: 'audio-player',
	templateUrl: './audio-player.component.html',
	styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
	@Input() audioSrc: string;
	@Input() config: AudioPlayerConfig;
	@ViewChild('audioPlayer') audioPlayer: ElementRef;
	@ViewChild('playhead') playhead: ElementRef;
	@ViewChild('timeline') timeline: ElementRef;
	public $trackLength: Observable<number>;
	public isPlaying: boolean = false;
	public isReadyForPlayback = false;
	public $currentTimeDisplay: Observable<number>;
	public $playheadPosition: Observable<number>;

	constructor() {}

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
		this.$trackLength = Observable.fromEvent(this.audioPlayer.nativeElement, 'canplaythrough')
			.map(() => this.setTrackLengthOnLoad())
			.startWith(0);
		this.$currentTimeDisplay = Observable.fromEvent(this.audioPlayer.nativeElement, 'timeupdate')
			.map(() => this.updateCurrentTimeDisplay())
			.startWith(0);
		this.$playheadPosition = Observable.fromEvent(this.audioPlayer.nativeElement, 'timeupdate')
			.map(() => this.updatePlayheadPosition())
			.startWith(0);
	}

	ngAfterViewInit() {}

	setTrackLengthOnLoad(): number {
		this.isReadyForPlayback = true;
		return Math.ceil(this.audioPlayer.nativeElement.duration);
	}

	updateCurrentTimeDisplay(): number {
		const current = this.audioPlayer.nativeElement.currentTime;
		const duration = this.audioPlayer.nativeElement.duration;
		if (current === duration) {
			return 0;
		}
		return Math.ceil(current);
	}

	updatePlayheadPosition(): number {
		const percentAsDecimal = this.audioPlayer.nativeElement.currentTime / this.audioPlayer.nativeElement.duration;
		if (percentAsDecimal >= 1) {
			this.isPlaying = false;
			return 0;
		}
		return 100 * percentAsDecimal;
	}

	clickOnPlayhead(ev: any) {
		// this.manuallyMovePlayhead(ev);
	}

	// manuallyMovePlayhead(ev: any) {
	// 	let newPercent = this.getPercentPosition(ev);
	// 	newPercent = newPercent < 0 ? 0 : newPercent;
	// 	newPercent = newPercent > 1 ? 1 : newPercent;
	// 	if (newPercent !== 1) {
	// 		const newCurrentTime: number = this.trackLength * newPercent;
	// 		this.audioPlayer.nativeElement.currentTime = newCurrentTime;
	// 		this.playheadPosition = 100 * newPercent;
	// 		this.setPlayerCurrentTimeDisplay(Math.ceil(newCurrentTime));
	// 		// this.changeDetectorRef.detectChanges();
	// 	}
	// }

	// setPlayerCurrentTimeDisplay(time: number) {
	// 	this.currentTimeDisplay = time;
	// }

	getPercentPosition(ev: any) {
		const clientX: number = ev.clientX;
		const boundingClientRectLeft: number = this.timeline.nativeElement.getBoundingClientRect().left;
		const timelineWidth: number = this.timeline.nativeElement.offsetWidth;
		const newPercent = (clientX - boundingClientRectLeft) / timelineWidth;
		return newPercent;
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
