import {IFunctionProxy, createFunctionProxy} from "./functionProxy";
import {IMockConfigurator, IMockProxy} from "./mock";
import {createFunctionConfigurationCreator, IFunctionConfigurationCreator} from "./functionConfiguration";

interface IInstanceIndexer {
	[key:string]:any;
}

export class InstanceMockConfigurator implements IMockConfigurator {

	constructor(instance:IInstanceIndexer) {
		for (let key in instance) {
			const member = instance[key];
			if (typeof member === "function") {
				this[key] = createFunctionConfigurationCreator<any>(key);
			}
		}
	}

	[name:string]:IFunctionConfigurationCreator<any>;

}

export class InstanceMockProxy implements IMockProxy {

	constructor(instance:IInstanceIndexer) {
		for (let key in instance) {
			const member = instance[key];
			if (typeof member === "function") {
				this[key] = createFunctionProxy(key, member);
			}
		}
	}

	[name:string]:IFunctionProxy;

}

