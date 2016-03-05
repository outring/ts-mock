import {MethodCall} from "./methodCall";
import {MethodConfiguration} from "./methodConfiguration";

export class MethodProxyDescriptor {

	private _name:string;
	private _fallback:Function;

	private _calls:MethodCall[] = [];
	private _callNumber = 0;
	private _configurations:{[number:number]:MethodConfiguration<any>[]} = {};

	constructor(name:string, fallback:Function) {
		this._name = name;
		this._fallback = fallback;
	}

	public getName():string {
		return this._name;
	}

	public getCalls():MethodCall[] {
		return this._calls;
	}

	public addConfiguration(configuration:MethodConfiguration<any>):void {
		if (!this._configurations[configuration.getCallNumber()]) {
			this._configurations[configuration.getCallNumber()] = [];
		}

		this._configurations[configuration.getCallNumber()].push(configuration);
	}

	public execute(context:any, args:any[]):any {
		this._calls.push(new MethodCall(this._callNumber, args));
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