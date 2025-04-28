import { ApplyOptions } from '@sapphire/decorators';
import { MethodNames, Route } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({ route: 'hello-world' })
export class UserRoute extends Route {
	override run(_request: Route.Request, response: Route.Response) {
		switch (_request.method) {
			case MethodNames[6]:
				response.json({ message: 'Hello World' });
				break;

			case MethodNames[19]:
				response.json({ message: 'Hello World' });
				break;

			default:
				break;
		}
	}
}
