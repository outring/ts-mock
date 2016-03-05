export class MethodCall {

	private _number:number;
	private _args:any[];

	constructor(number:number, args:any[]) {
		this._number = number;
		this._args = args;
	}

	public getNumber():number {
		return this._number;
	}

	public getArgs():any[] {
		return this._args;
	}

}