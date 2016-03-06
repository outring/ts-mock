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
	callback(callback:(...args:any[]) => void):IFunctionConfigurator<TResult>;
	returns(result:TResult):IFunctionConfigurator<TResult>;
	throws(error:any):IFunctionConfigurator<TResult>;
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

	public getCallNumber():number {
		return this._callNumber;
	}

	public getName():string {
		return this._name;
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

	public returns(result:TResult|((...args:any[]) => TResult)):IFunctionConfigurator<TResult> {
		this._ensureCallNotConfigured();
		this._call = typeof result === "function" ? <(...args:any[]) => TResult>result : () => <TResult>result;
		return this;
	}

	public throws(error:any):IFunctionConfigurator<TResult> {
		this._ensureCallNotConfigured();
		this._call = <() => TResult>(() => { throw error; });
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