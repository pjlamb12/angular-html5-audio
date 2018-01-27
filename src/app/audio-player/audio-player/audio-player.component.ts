import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AudioPlayerConfig } from '../audio-player-config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/delay';
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
	public trackLength$: Observable<number>;
	public isPlaying: boolean = false;
	public wasPlaying: boolean = false;
	public isReadyForPlayback = false;
	public currentTimeDisplay$: Observable<number>;
	public playheadPosition$: Observable<number>;
	private eventCounter: number = 0;
	private mousedownIsOnPlayhead: boolean = false;

	constructor() {}

	ngOnInit() {
		this.setOnLoadConfig();
		this.trackLength$ = Observable.fromEvent(this.audioPlayer.nativeElement, 'canplaythrough')
			.map(() => this.setTrackLengthOnLoad())
			.delay(0);
		// .startWith(0);
		this.currentTimeDisplay$ = Observable.fromEvent(this.audioPlayer.nativeElement, 'timeupdate')
			.map(() => this.updateCurrentTimeDisplay())
			.delay(0);
		// .startWith(0);
		const playheadPositionTimelineClick$ = Observable.fromEvent(this.timeline.nativeElement, 'click')
			.map(ev => this.manuallyMovePlayhead(ev))
			.delay(0);
		const playheadPositionTimeupdate$ = Observable.fromEvent(this.audioPlayer.nativeElement, 'timeupdate')
			.map(() => this.updatePlayheadPosition())
			.delay(0);
		// .startWith(0);
		const playheadMousemove$ = Observable.fromEvent(document, 'mousemove')
			.map((mmEv: MouseEvent) => {
				if (this.mousedownIsOnPlayhead) {
					const newPosition = this.manuallyMovePlayhead(mmEv);
					return newPosition;
				}
				return 100 * (this.audioPlayer.nativeElement.currentTime / this.audioPlayer.nativeElement.duration);
			})
			.delay(0);
		// .startWith(0);
		this.playheadPosition$ = Observable.merge(
			playheadPositionTimeupdate$,
			playheadMousemove$,
			playheadPositionTimelineClick$,
		);
		this.playhead.nativeElement.addEventListener('mousedown', this.onPlayheadMousedownEvent.bind(this));
		document.addEventListener('mouseup', this.onPlayheadMouseupEvent.bind(this));
	}

	ngOnChanges() {
		if (this.audioSrc) {
			this.reset();
		}
	}

	onPlayheadMousedownEvent() {
		this.mousedownIsOnPlayhead = true;
		this.wasPlaying = !!this.isPlaying;
		this.pause();
	}

	onPlayheadMouseupEvent() {
		this.mousedownIsOnPlayhead = false;
		if (this.wasPlaying) {
			this.play();
		}
		this.wasPlaying = false;
	}

	setOnLoadConfig() {
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

	manuallyMovePlayhead(ev: any) {
		let newPercent = this.getPercentPosition(ev);
		newPercent = newPercent < 0 ? 0 : newPercent;
		newPercent = newPercent > 1 ? 1 : newPercent;
		if (newPercent < 1) {
			const newCurrentTime: number = this.audioPlayer.nativeElement.duration * newPercent;
			this.audioPlayer.nativeElement.currentTime = newCurrentTime;
			return 100 * newPercent;
		} else if (newPercent === 1) {
			return 100;
		}
		return 0;
	}

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

	reset() {
		this.isPlaying = false;
		this.wasPlaying = false;
	}
}
