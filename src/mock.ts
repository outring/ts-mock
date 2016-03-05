import {MethodCall} from "./methodCall";
import {MethodProxyDescriptor} from "./methodProxyDescriptor";
import {IMethodConfiguration, MethodConfiguration} from "./methodConfiguration";

interface IInstanceIndexer {
    [key:string]:any;
}

interface IMethodProxy {
    (...args:any[]):any;
    descriptor:MethodProxyDescriptor;
}

interface IMethodConfigurator<TResult> {
    (...args:any[]):MethodConfiguration<TResult>;
}

interface IMethodConstraint {
    verify(calls:MethodCall[]):boolean;
}


function createMethodProxy(name:string, fallback:Function):IMethodProxy {
    const descriptor = new MethodProxyDescriptor(name, fallback);

    const methodProxy = <IMethodProxy>function (...args:any[]):any {
        return descriptor.execute(this, args);
    };

    methodProxy.descriptor = descriptor;

    return methodProxy;
}

function createMethodConfigurator<TResult>(name:string):IMethodConfigurator<TResult> {
    return function (...args:any[]):MethodConfiguration<TResult> {
        return new MethodConfiguration<TResult>(name, args);
    };
}

class MockInstanceBasedConfigurator {

    constructor(instance:IInstanceIndexer) {
        for (let key in instance) {
            const member = instance[key];
            if (typeof member === "function") {
                this[key] = createMethodConfigurator<any>(key);
            }
        }
    }

    [key:string]:IMethodConfigurator<any>;

}

class MockProxy {

    constructor(instance:IInstanceIndexer) {
        for (let key in instance) {
            const member = instance[key];
            if (typeof member === "function") {
                this[key] = createMethodProxy(key, member);
            }
        }
    }

    [key:string]:IMethodProxy;

}

export class Mock<T extends {}> {

    private _configurator:MockInstanceBasedConfigurator;
    private _proxy:MockProxy;

    constructor(instance:T) {
        this._configurator = new MockInstanceBasedConfigurator(<any>instance);
        this._proxy = new MockProxy(<any>instance);
    }

    public get object():T {
        return <any>this._proxy;
    }

    public setup<TResult>(methodSetup:(instance:T) => TResult):IMethodConfiguration<TResult> {
        const methodConfiguration = <MethodConfiguration<TResult>><any>methodSetup(<any>this._configurator);
        const methodProxy = this._proxy[methodConfiguration.name];
        methodProxy.descriptor.addConfiguration(methodConfiguration);
        return methodConfiguration;
    }

    public verify<TResult>(methodVerification:(instance:T) => TResult, constraint:IMethodConstraint = null):void {
        const methodConfiguration = <MethodConfiguration<TResult>>methodVerification(<any>this._configurator);
        const methodProxy = this._proxy[methodConfiguration.name];
        const suitableCalls = methodProxy.descriptor.calls.filter(c => methodConfiguration.isSuitable(c.args));
        const verified = constraint !== null ? constraint.verify(suitableCalls) : suitableCalls.length > 0;
        if (!verified) {
            throw new Error(`Expected method ${methodProxy.name} to be called`);
        }
    }

}