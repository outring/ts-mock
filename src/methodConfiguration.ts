import {ArgumentConstraintBase} from "./argumentConstraint";

const nonConfiguredCallNumber = -1;

export interface IMethodConfiguration<TResult> {
    callback(callback:(...args:any[]) => TResult):IMethodConfiguration<TResult>;
    returns(result:TResult):IMethodConfiguration<TResult>;
    throws(error:any):IMethodConfiguration<TResult>;
    onCall(number:number):IMethodConfiguration<TResult>;
}

export class MethodConfiguration<TResult> implements IMethodConfiguration<TResult> {

    private _args:any[];
    private _callbacks:Function[] = [];
    private _call:(...args:any[]) => TResult;

    constructor(name:string, args:any[] = []) {
        this.name = name;
        this._args = args;
    }

    public name:string;
    public callNumber:number = nonConfiguredCallNumber;

    public get specificity():number {
        const anyArgs = this._args.filter(a => a instanceof ArgumentConstraintBase && !a.isStrict());
        return this._args.length - anyArgs.length;
    }

    public isSuitable(args:any[]):boolean {
        return args.length === this._args.length && args.every((a, i) => {
                const constraint = this._args[i];
                return constraint instanceof ArgumentConstraintBase ? constraint.verify(a) : a === constraint;
            });
    }

    public execute(args:any):TResult {
        this._callbacks.forEach(c => c.apply(null, args));
        return this._call ? this._call.apply(null, args) : undefined;
    }

    public callback(callback:(...args:any[]) => TResult):IMethodConfiguration<TResult> {
        this._callbacks.push(callback);

        return this;
    }

    public returns(result:TResult|((...args:any[]) => TResult)):IMethodConfiguration<TResult> {
        this._ensureCallNotConfigured();

        this._call = typeof result === "function" ? <(...args:any[]) => TResult>result : () => <TResult>result;

        return this;
    }

    public throws(error:any):IMethodConfiguration<TResult> {
        this._ensureCallNotConfigured();

        this._call = <() => TResult>(() => { throw error; });

        return this;
    }

    public onCall(number:number):IMethodConfiguration<TResult> {
        if (this.callNumber !== nonConfiguredCallNumber) {
            throw new Error(`Method ${this.name} call number is already configured`);
        }

        this.callNumber = number;

        return this;
    }

    private _ensureCallNotConfigured() {
        if (this._call) {
            throw new Error(`Method ${this.name} call is already configured`);
        }
    }

}