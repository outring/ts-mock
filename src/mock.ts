import {MethodCall} from "./methodCall";
import {IMethodConfigurator, MethodConfiguration} from "./methodConfiguration";
import {MethodProxyDescriptor} from "./methodProxyDescriptor";
import {InstanceMockConfigurator, InstanceMockProxy} from "./instanceMock";

export interface IMethodProxy {
	(...args:any[]):any;
	descriptor:MethodProxyDescriptor;
}

export interface IMockConfigurator {
	[name:string]:IMethodConfigurator<any>;
}

export interface IMockProxy {
	[name:string]:IMethodProxy;
}

export interface IMethodConstraint {
	verify(calls:MethodCall[]):boolean;
}

export interface IMock<T extends {}> {
	getObject():T;
	setup<TResult>(methodSetup:(instance:T) => TResult):IMethodConfigurator<TResult>;
	verify<TResult>(methodVerification:(instance:T) => TResult, constraint:IMethodConstraint = null):void;
}

export class Mock<T extends {}> implements IMock<T> {

	private _configurator:IMockConfigurator;
	private _proxy:IMockProxy;

	constructor(instance:T) {
		this._configurator = new InstanceMockConfigurator(<any>instance);
		this._proxy = new InstanceMockProxy(<any>instance);
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