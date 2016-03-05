import {MethodCall} from "./methodCall";
import {MethodConfiguration} from "./methodConfiguration";

export class MethodProxyDescriptor {

    private _fallback:Function;

    private _callNumber = 0;
    private _configurations:{[number:number]:MethodConfiguration<any>[]} = {};

    constructor(name:string, fallback:Function) {
        this.name = name;
        this._fallback = fallback;
    }

    public name:string;
    public calls:MethodCall[] = [];

    public addConfiguration(configuration:MethodConfiguration<any>):void {
        if (!this._configurations[configuration.callNumber]) {
            this._configurations[configuration.callNumber] = [];
        }

        this._configurations[configuration.callNumber].push(configuration);
    }

    public execute(context:any, args:any[]):any {
        const configurations = this._configurations[this._callNumber] || this._configurations[-1];

        this.calls.push(new MethodCall(this._callNumber, args));
        this._callNumber++;

        if (configurations) {
            const sortedConfigurations = configurations.sort((c1, c2) => c2.specificity - c1.specificity);
            for (let configuration of sortedConfigurations) {
                if (configuration.isSuitable(args)) {
                    return configuration.execute(args);
                }
            }
        }

        return this._fallback.apply(context, args);
    }

}