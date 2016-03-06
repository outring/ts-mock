import {FunctionCall} from "./functionCall";
import {FunctionConfiguration} from "./functionConfiguration";

export interface IFunctionProxy {
	(...args:any[]):any;
	descriptor:FunctionProxyDescriptor;
}

export class FunctionProxyDescriptor {

	private _name:string;
	private _fallback:Function;

	private _calls:FunctionCall[] = [];
	private _callNumber = 0;
	private _configurations:{[number:number]:FunctionConfiguration<any>[]} = {};

	constructor(name:string, fallback:Function) {
		this._name = name;
		this._fallback = fallback;
	}

	public getName():string {
		return this._name;
	}

	public getCalls():FunctionCall[] {
		return this._calls;
	}

	public addConfiguration(configuration:FunctionConfiguration<any>):void {
		if (!this._configurations[configuration.getCallNumber()]) {
			this._configurations[configuration.getCallNumber()] = [];
		}

		this._configurations[configuration.getCallNumber()].push(configuration);
	}

	public execute(context:any, args:any[]):any {
		this._calls.push(new FunctionCall(this._callNumber, args));
		this._callNumber++;

		const configurations = this._configurations[this._callNumber] || this._configurations[-1];
		if (configurations) {
			const sortedConfigurations = configurations.sort((c1, c2) => c2.getSpecificity() - c1.getSpecificity());
			for (let configuration of sortedConfigurations) {
				if (configuration.isSuitable(args)) {
					return configuration.execute(args);
				}
			}
		}

		return this._fallback.apply(context, args);
	}

}