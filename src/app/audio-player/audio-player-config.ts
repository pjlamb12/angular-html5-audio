export interface AudioPlayerConfig {
	timelineConfig: {
		timelineColor: string;
		timelineHeight: number;
		playheadHeight: number;
		playheadColor: string;
		opacity: string;
	};
	playPauseConfig: {
		iconClassPrefix: string;
		playIconClass: string;
		pauseIconClass: string;
		iconPixelSize: number;
		playIconColor: string;
		pauseIconColor: string;
	};
}
