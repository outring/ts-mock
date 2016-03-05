import {MethodConfiguration} from "./methodConfiguration";
import {MethodProxyDescriptor} from "./methodProxyDescriptor";
import {IMethodProxy, IMockConfigurator, IMockProxy} from "./mock";

interface IInstanceIndexer {
	[key:string]:any;
}

interface IMethodConfigurator<TResult> {
	(...args:any[]):MethodConfiguration<TResult>;
}

function createMethodProxy(name:string, fallback:Function):IMethodProxy {
	const descriptor = new MethodProxyDescriptor(name, fallback);
	const methodProxy = <IMethodProxy>function (...args:any[]):any {
		return descriptor.execute(this, args);
	};
	methodProxy.descriptor = descriptor;
	return methodProxy;
}

function createMethodConfigurator<TResult>(name:string):IMethodConfigurator<TResult> {
	return function (...args:any[]):MethodConfiguration<TResult> {
		return new MethodConfiguration<TResult>(name, args);
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

	[name:string]:IMethodProxy;

}

