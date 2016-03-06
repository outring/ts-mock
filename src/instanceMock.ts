import {FunctionConfiguration} from "./functionConfiguration";
import {FunctionProxyDescriptor} from "./functionProxy";
import {IFunctionProxy, IMockConfigurator, IMockProxy} from "./mock";

interface IInstanceIndexer {
	[key:string]:any;
}

interface IMethodConfigurator<TResult> {
	(...args:any[]):FunctionConfiguration<TResult>;
}

function createMethodProxy(name:string, fallback:Function):IFunctionProxy {
	const descriptor = new FunctionProxyDescriptor(name, fallback);
	const methodProxy = <IFunctionProxy>function (...args:any[]):any {
		return descriptor.execute(this, args);
	};
	methodProxy.descriptor = descriptor;
	return methodProxy;
}

function createMethodConfigurator<TResult>(name:string):IMethodConfigurator<TResult> {
	return function (...args:any[]):FunctionConfiguration<TResult> {
		return new FunctionConfiguration<TResult>(name, args);
	};
}

export class InstanceMockConfigurator implements IMockConfigurator {

	constructor(instance:IInstanceIndexer) {
		for (let key in instance) {
			const member = instance[key];
			if (typeof member === "function") {
				this[key] = createMethodConfigurator<any>(key);
			}
		}
	}

	[name:string]:IMethodConfigurator<any>;

}

export class InstanceMockProxy implements IMockProxy {

	constructor(instance:IInstanceIndexer) {
		for (let key in instance) {
			const member = instance[key];
			if (typeof member === "function") {
				this[key] = createMethodProxy(key, member);
			}
		}
	}

	[name:string]:IFunctionProxy;

}

