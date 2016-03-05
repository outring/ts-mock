import {ArgumentConstraint, ArrayArgumentConstraint, IArgumentConstraint} from "./argumentConstraint";

interface IConstructor<T> {
	new(...args:any[]):T;
}

export function isAny():any;
export function isAny<T>(type:IConstructor<T>):T;
export function isAny(type:IConstructor<any> = null):any {
	return <any>new ArgumentConstraint(type);
}

export function isSome(constraint:IArgumentConstraint<any>):any;
export function isSome<T>(type:IConstructor<T>, constraint:IArgumentConstraint<T>):T;
export function isSome(typeOrConstraint:any, constraint:IArgumentConstraint<any> = null):any {
	return arguments.length === 1 ?
		new ArgumentConstraint(null, typeOrConstraint) :
		new ArgumentConstraint(typeOrConstraint, constraint);
}

export function isAnyArray():any[];
export function isAnyArray<T>(type:IConstructor<T>):T[];
export function isAnyArray(type:IConstructor<any> = null):any {
	return new ArrayArgumentConstraint(new ArgumentConstraint(type));
}

export function isSomeArray(constraint:IArgumentConstraint<any>):any[];
export function isSomeArray<T>(elementType:IConstructor<T>, constraint:IArgumentConstraint<T>):T[];
export function isSomeArray(constraintOrElementType?:any, constraint:IArgumentConstraint<any> = null):any {
	return arguments.length === 1 ?
		new ArrayArgumentConstraint(null, constraintOrElementType) :
		new ArrayArgumentConstraint(new ArgumentConstraint(constraintOrElementType), constraint);
}

export function isArrayOfSome(elementConstraint:IArgumentConstraint<any>):any[];
export function isArrayOfSome<T>(elementType:IConstructor<T>, elementConstraint:IArgumentConstraint<T>):T[];
export function isArrayOfSome(elementConstraintOrElementType?:any, elementConstraint:IArgumentConstraint<any> = null):any {
	return arguments.length === 1 ?
		new ArrayArgumentConstraint(new ArgumentConstraint(null, elementConstraintOrElementType)) :
		new ArrayArgumentConstraint(new ArgumentConstraint(elementConstraintOrElementType, elementConstraint));
}

export function isInRange(from:number, to:number, isInclusive:boolean = true):number {
	return isInclusive ?
		<any>new ArgumentConstraint(Number, x => x >= from && x <= to) :
		<any>new ArgumentConstraint(Number, x => x > from && x < to);
}

export function isOneOf<T>(list:T[]):T {
	return <any>new ArgumentConstraint<T>(null, x => list.indexOf(x) > -1)
}

export function isNotOneOf<T>(list:T[]):T {
	return <any>new ArgumentConstraint<T>(null, x => list.indexOf(x) === -1)
}