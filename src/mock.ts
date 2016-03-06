import {FunctionCall} from "./functionCall";
import {IFunctionConfigurator, FunctionConfiguration} from "./functionConfiguration";
import {IFunctionProxy} from "./functionProxy";
import {InstanceMockConfigurator, InstanceMockProxy} from "./instanceMock";

export interface IMockConfigurator {
	[name:string]:FunctionConfiguration<any>;
}

export interface IMockProxy {
	[name:string]:IFunctionProxy;
}

export interface IMethodConstraint {
	(calls:FunctionCall[]):boolean;
}

export interface IMock<T extends {}> {
	getObject():T;
	setup<TResult>(methodSetup:(instance:T) => TResult):IFunctionConfigurator<TResult>;
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

	public setup<TResult>(setup:(instance:T) => TResult):FunctionConfiguration<TResult> {
		const methodConfiguration = <FunctionConfiguration<TResult>><any>setup(<any>this._configurator);
		const methodProxy = this._proxy[methodConfiguration.getName()];
		methodProxy.descriptor.addConfiguration(methodConfiguration);
		return methodConfiguration;
	}

	public verify<TResult>(verify:(instance:T) => TResult, constraint:IMethodConstraint = null):void {
		const methodConfiguration = <FunctionConfiguration<TResult>>verify(<any>this._configurator);
		const methodProxy = this._proxy[methodConfiguration.getName()];
		const suitableCalls = methodProxy.descriptor.getCalls().filter(c => methodConfiguration.isSuitable(c.getArgs()));
		const verified = constraint !== null ? constraint(suitableCalls) : suitableCalls.length > 0;
		if (!verified) {
			throw new Error(`Expected method ${methodProxy.name} to be called`);
		}
	}

}