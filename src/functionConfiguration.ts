import {ArgumentConstraintBase} from "./argumentConstraint";

const nonConfiguredCallNumber = -1;

export interface IFunctionConfiguration<TResult> {
	getName():string;
	getCallNumber():number;
	getSpecificity():number;
	isSuitable(args:any[]):boolean;
	execute(args:any[]):TResult;
}

export interface IFunctionConfigurator<TResult> {
	callback<T1>(callback:(arg1:T1) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2>(callback:(arg1:T1, arg2:T2) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3>(callback:(arg1:T1, arg2:T2, arg3:T3) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3, T4>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3, T4, T5>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3, T4, T5, T6>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3, T4, T5, T6, T7>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3, T4, T5, T6, T7, T8>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3, T4, T5, T6, T7, T8, T9>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8, arg9:T9) => void):IFunctionConfigurator<TResult>;
	callback<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8, arg9:T9, arg10:T10) => void):IFunctionConfigurator<TResult>;
	callback(callback:(...args:any[]) => void):IFunctionConfigurator<TResult>;

	returns<T1>(callback:(arg1:T1) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2>(callback:(arg1:T1, arg2:T2) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3>(callback:(arg1:T1, arg2:T2, arg3:T3) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3, T4>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3, T4, T5>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3, T4, T5, T6>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3, T4, T5, T6, T7>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3, T4, T5, T6, T7, T8>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3, T4, T5, T6, T7, T8, T9>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8, arg9:T9) => TResult):IFunctionConfigurator<TResult>;
	returns<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8, arg9:T9, arg10:T10) => TResult):IFunctionConfigurator<TResult>;
	returns(callback:(...args:any[]) => TResult):IFunctionConfigurator<TResult>;

	throws<T1>(callback:(arg1:T1) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2>(callback:(arg1:T1, arg2:T2) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3>(callback:(arg1:T1, arg2:T2, arg3:T3) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3, T4>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3, T4, T5>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3, T4, T5, T6>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3, T4, T5, T6, T7>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3, T4, T5, T6, T7, T8>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3, T4, T5, T6, T7, T8, T9>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8, arg9:T9) => any):IFunctionConfigurator<TResult>;
	throws<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(callback:(arg1:T1, arg2:T2, arg3:T3, arg4:T4, arg5:T5, arg6:T6, arg7:T7, arg8:T8, arg9:T9, arg10:T10) => any):IFunctionConfigurator<TResult>;
	throws(callback:() => any):IFunctionConfigurator<TResult>;

	onCall(number:number):IFunctionConfigurator<TResult>;
}

export class FunctionConfiguration<TResult> implements IFunctionConfigurator<TResult>, IFunctionConfiguration<TResult> {

	private _name:string;
	private _args:any[];

	private _callbacks:Function[] = [];
	private _call:(...args:any[]) => TResult;
	private _callNumber:number = nonConfiguredCallNumber;

	constructor(name:string, args:any[]) {
		this._name = name;
		this._args = args;
	}

	public getName():string {
		return this._name;
	}

	public getCallNumber():number {
		return this._callNumber;
	}

	public getSpecificity():number {
		const anyArgs = this._args.filter(a => a instanceof ArgumentConstraintBase && !a.isStrict());
		return this._args.length - anyArgs.length;
	}

	public isSuitable(args:any[]):boolean {
		return args.length === this._args.length && args.every((a, i) => {
				const constraint = this._args[i];
				return constraint instanceof ArgumentConstraintBase ? constraint.verify(a) : a === constraint;
			});
	}

	public execute(args:any[]):TResult {
		this._callbacks.forEach(c => c.apply(null, args));
		return this._call ? this._call.apply(null, args) : undefined;
	}

	public callback(callback:(...args:any[]) => void):IFunctionConfigurator<TResult> {
		this._callbacks.push(callback);
		return this;
	}

	public returns(callback:(...args:any[]) => TResult):IFunctionConfigurator<TResult> {
		this._ensureCallNotConfigured();
		this._call = <(...args:any[]) => TResult>callback;
		return this;
	}

	public throws(callback:(...args:any[]) => any):IFunctionConfigurator<TResult> {
		this._ensureCallNotConfigured();
		this._call = <() => TResult>((...args:any[]) => { throw callback.apply(null, args); });
		return this;
	}

	public onCall(number:number):IFunctionConfigurator<TResult> {
		if (this._callNumber !== nonConfiguredCallNumber) {
			throw new Error(`Function ${this.getName()} call number is already configured`);
		}
		this._callNumber = number;
		return this;
	}

	private _ensureCallNotConfigured() {
		if (this._call) {
			throw new Error(`Function ${this.getName()} call is already configured`);
		}
	}

}

export interface IFunctionConfigurationCreator<TResult> {
	(...args:any[]):FunctionConfiguration<TResult>;
}

export function createFunctionConfigurationCreator<TResult>(name:string):IFunctionConfigurationCreator<TResult> {
	return function (...args:any[]):FunctionConfiguration<TResult> {
		return new FunctionConfiguration<TResult>(name, args);
	};
}