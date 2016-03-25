import {createFunctionProxy} from "./functionProxy";
import {IMockConfigurator, IMockProxy} from "./mock";
import {createFunctionConfigurationCreator, IFunctionConfigurationCreator} from "./functionConfiguration";

interface IInstanceIndexer {
	[key:string]:any;
}

class InstanceMockConfigurator<T extends {}> implements IMockConfigurator {

	constructor(instance:T) {
		const instanceIndexer = <IInstanceIndexer>instance;
		for (let key in instanceIndexer) {
			const member = instanceIndexer[key];
			if (typeof member === "function") {
				this[key] = createFunctionConfigurationCreator<any>(key);
			}
		}
	}

	[name:string]:IFunctionConfigurationCreator<any>;

}

export function createInstanceMockConfigurator<T extends {}>(instance:T):IMockConfigurator {
	return new InstanceMockConfigurator(instance);
}

export function createInstanceMockProxy<T extends {}>(instance:T):IMockProxy {
	const instanceIndexer = <IInstanceIndexer>instance;
	for (let key in instanceIndexer) {
		const member = instanceIndexer[key];
		if (typeof member === "function") {
			instanceIndexer[key] = createFunctionProxy(key, member);
		}
	}
	return instanceIndexer;
}

