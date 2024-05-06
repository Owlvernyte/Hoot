import { Listener, ListenerOptions, container } from '@sapphire/framework';
import DisTube, { DisTubeEvents } from 'distube';

export abstract class BaseDisTubeListener<E extends keyof DisTubeEvents> extends Listener<E, ListenerOptions> {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			emitter: container.distube
		});
	}
}

declare module '@sapphire/framework' {
	interface Container {
		distube: DisTube;
	}
}
