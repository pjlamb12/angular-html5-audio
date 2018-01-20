import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AudioPlayerModule } from './audio-player/audio-player.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AudioPlayerModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
