import {FunctionCall} from "./functionCall";
import {FunctionConfiguration, IFunctionConfigurator, IFunctionConfigurationCreator} from "./functionConfiguration";
import {IFunctionProxy} from "./functionProxy";
import {createInstanceMockProxy, createInstanceMockConfigurator} from "./instanceMock";

export interface IMockConfigurator {
	[name:string]:IFunctionConfigurationCreator<any>;
}

export interface IMockProxy {
	[name:string]:IFunctionProxy;
}

export interface IMethodConstraint {
	verify(calls:FunctionCall[]):boolean;
	getErrorMessage(calls:FunctionCall[]):string;
}

export interface IMock<T extends {}> {
	getObject():T;
	setup<TResult>(methodSetup:(instance:T) => TResult):IFunctionConfigurator<TResult>;
	verify<TResult>(methodVerification:(instance:T) => TResult, constraint?:IMethodConstraint):void;
}

export class Mock<T extends {}> implements IMock<T> {

	private _configurator:IMockConfigurator;
	private _proxy:IMockProxy;

	constructor(instance:T, isStrict:boolean = false) {
		this._configurator = createInstanceMockConfigurator(instance);
		this._proxy = createInstanceMockProxy(instance);
	}

	public getObject():T {
		return <any>this._proxy;
	}

	public setup<TResult>(setup:(instance:T) => TResult):IFunctionConfigurator<TResult> {
		const methodConfiguration = <FunctionConfiguration<TResult>><any>setup(<any>this._configurator);
		const methodProxy = this._proxy[methodConfiguration.getName()];
		methodProxy.descriptor.addConfiguration(methodConfiguration);
		return methodConfiguration;
	}

	public verify<TResult>(verify:(instance:T) => TResult, constraint:IMethodConstraint = null):void {
		const methodConfiguration = <FunctionConfiguration<TResult>><any>verify(<any>this._configurator);
		const methodProxy = this._proxy[methodConfiguration.getName()];
		const calls = methodProxy.descriptor.getCalls();
		const suitableCalls = calls.filter(c => methodConfiguration.isSuitable(c.getArgs()));
		if (constraint !== null) {
			if (!constraint.verify(suitableCalls)) {
				throw new Error(constraint.getErrorMessage(suitableCalls));
			}
		}
		else if (suitableCalls.length === 0) {
			throw new Error(`Expected method ${methodConfiguration.getName()} to be called`);
		}
	}

}
