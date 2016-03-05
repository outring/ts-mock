import {MethodConfiguration} from "./methodConfiguration";
import {MethodProxyDescriptor} from "./methodProxyDescriptor";
import {IMock, IMethodConstraint} from "./mock";
interface IInstanceIndexer {
	[key:string]:any;
}

interface IMethodProxy {
	(...args:any[]):any;
	descriptor:MethodProxyDescriptor;
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

class Configurator {

	constructor(instance:IInstanceIndexer) {
		for (let key in instance) {
			const member = instance[key];
			if (typeof member === "function") {
				this[key] = createMethodConfigurator<any>(key);
			}
		}
	}

	[key:string]:IMethodConfigurator<any>;

}

class Proxy {

	constructor(instance:IInstanceIndexer) {
		for (let key in instance) {
			const member = instance[key];
			if (typeof member === "function") {
				this[key] = createMethodProxy(key, member);
			}
		}
	}

	[key:string]:IMethodProxy;

}

export class InstanceMock<T extends {}> implements IMock<T> {

	private _configurator:Configurator;
	private _proxy:Proxy;

	constructor(instance:T) {
		this._configurator = new Configurator(<any>instance);
		this._proxy = new Proxy(<any>instance);
	}

	public getObject():T {
		return <any>this._proxy;
	}

	public setup<TResult>(methodSetup:(instance:T) => TResult):MethodConfiguration<TResult> {
		const methodConfiguration = <MethodConfiguration<TResult>><any>methodSetup(<any>this._configurator);
		const methodProxy = this._proxy[methodConfiguration.getName()];
		methodProxy.descriptor.addConfiguration(methodConfiguration);
		return methodConfiguration;
	}

	public verify<TResult>(methodVerification:(instance:T) => TResult, constraint:IMethodConstraint = null):void {
		const methodConfiguration = <MethodConfiguration<TResult>>methodVerification(<any>this._configurator);
		const methodProxy = this._proxy[methodConfiguration.getName()];
		const suitableCalls = methodProxy.descriptor.getCalls().filter(c => methodConfiguration.isSuitable(c.getArgs()));
		const verified = constraint !== null ? constraint.verify(suitableCalls) : suitableCalls.length > 0;
		if (!verified) {
			throw new Error(`Expected method ${methodProxy.name} to be called`);
		}
	}

}