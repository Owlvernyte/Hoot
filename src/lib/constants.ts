import { predefined } from '@sapphire/time-utilities';
import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];

export const maxSongs = 100;

export enum ButtonCustomIds {
	Pause = 'pause',
	VolumeUp = 'volumeup',
	Shuffle = 'shuffle',
	Lyrics = 'lyrics',
	AutoPlay = 'autoplay',
	VolumeDown = 'volumedown',
	Loop = 'loop',
	Favorite = 'favorite',
	AddToPlaylist = 'addtopl',
	NextTrack = 'next-track',
	PreviousTrack = 'pre-track',
	Claim = 'claim',
	SeekForward = 'seekforward',
	SeekBackward = 'seekbackward'
}

export enum CustomEvents {
	UpdatePanel = 'updatePanel'
}

export const statusCronTime: string = predefined['@hourly'];
