import {ArgumentConstraint, ArrayArgumentConstraint, IArgumentConstraint} from "./argumentConstraint";

interface IConstructor<T> {
	new(...args:any[]):T;
}

export function isAny():any;
export function isAny<T>(type:IConstructor<T>):T;
export function isAny(type:IConstructor<any> = null):any {
	return <any>new ArgumentConstraint(type);
}

export function isAnyArray():any[];
export function isAnyArray<T>(type:IConstructor<T>):T[];
export function isAnyArray(type:IConstructor<any> = null):any[] {
	return <any>new ArrayArgumentConstraint(new ArgumentConstraint(type));
}

export function isSome(constraint:IArgumentConstraint<any>):any;
export function isSome<T>(type:IConstructor<T>, constraint:IArgumentConstraint<T>):T;
export function isSome(type:IConstructor<any>|IArgumentConstraint<any>, constraint:IArgumentConstraint<any> = null):any {
	if (arguments.length === 1) {
		type = <any>constraint;
		constraint = null;
	}
	return <any>new ArgumentConstraint(<any>type, constraint);
}

export function isSomeArray(constraint:IArgumentConstraint<any>):any[];
export function isSomeArray<T>(elementType:IConstructor<T>, constraint:IArgumentConstraint<T>):T[];
export function isSomeArray(elementType:IConstructor<any>|IArgumentConstraint<any>, constraint:IArgumentConstraint<any> = null):any[] {
	if (arguments.length === 1) {
		elementType = <any>constraint;
		constraint = null;
	}
	return <any>new ArrayArgumentConstraint(new ArgumentConstraint(<any>elementType), constraint);
}
