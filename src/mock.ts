import {MethodCall} from "./methodCall";
import {IMethodConfigurator} from "./methodConfiguration";

export interface IMethodConstraint {
	verify(calls:MethodCall[]):boolean;
}

export interface IMock<T extends {}> {
	getObject():T;
	setup<TResult>(methodSetup:(instance:T) => TResult):IMethodConfigurator<TResult>;
	verify<TResult>(methodVerification:(instance:T) => TResult, constraint:IMethodConstraint = null):void;
}
