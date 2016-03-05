interface IConstructor<T> {
	new(...args:any[]):T;
}

interface IPrimitive {
	type:IConstructor<any>,
	typeName:string
}

const primitives:IPrimitive[] = [
	{ type: String, typeName: "string" },
	{ type: Number, typeName: "number" },
	{ type: Boolean, typeName: "boolean" }
];

export interface IArgumentConstraint<T> {
	(argument:T):boolean;
}

export abstract class ArgumentConstraintBase<T> {

	protected _constraint:IArgumentConstraint<T>;

	constructor(constraint:IArgumentConstraint<T> = null) {
		this._constraint = constraint;
	}

	public isStrict():boolean {
		return this._constraint !== null;
	}

	public abstract verify(argument:T):boolean;

}

export class ArgumentConstraint<T> extends ArgumentConstraintBase<T> {

	private _type:IConstructor<T>;

	constructor(type:IConstructor<T>, constraint:IArgumentConstraint<T> = null) {
		super(constraint);

		this._type = type;
	}

	public verify(argument:T):boolean {
		let isVerified = true;

		if (this._type !== null) {
			const primitive:IPrimitive = primitives.filter(p => p.type === this._type)[0];
			if (primitive) {
				isVerified = typeof argument === primitive.typeName || argument instanceof primitive.type;
			}
			else {
				isVerified = argument instanceof this._type;
			}
		}

		if (this._constraint !== null) {
			isVerified = isVerified && this._constraint(argument);
		}

		return isVerified;
	}

}

export class ArrayArgumentConstraint<T> extends ArgumentConstraintBase<T[]> {

	private _elementConstraint:ArgumentConstraint<T>;

	constructor(elementConstraint:ArgumentConstraint<T> = null, constraint:IArgumentConstraint<T[]> = null) {
		super(constraint);

		this._elementConstraint = elementConstraint;
	}

	public verify(argument:T[]):boolean {
		if (!(argument instanceof Array)) {
			return false;
		}

		let isVerified = true;

		if (this._elementConstraint !== null) {
			isVerified = argument.every(a => this._elementConstraint.verify(a));
		}

		if (this._constraint !== null) {
			isVerified = isVerified && this._constraint(argument);
		}

		return isVerified;
	}

}