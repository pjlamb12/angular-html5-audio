import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { TrackTimeDisplayPipe } from './pipes/track-time-display.pipe';

@NgModule({
	imports: [CommonModule],
	declarations: [AudioPlayerComponent, TrackTimeDisplayPipe],
	exports: [AudioPlayerComponent],
})
export class AudioPlayerModule {}
