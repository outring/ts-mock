import expect = require("expect.js");
import {isAny, isSome, isAnyArray, isSomeArray, isArrayOfSome, isInRange, isOneOf, isNotOneOf} from "../src/it";
import {ArgumentConstraint, ArrayArgumentConstraint} from "../src/argumentConstraint";

describe("it", () => {

	describe("isAny", () => {

		it("must return empty constraint if no arguments", () => {
			const constraint = <ArgumentConstraint<any>>isAny();

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.isStrict()).to.be(false);
			expect(constraint.verify("")).to.be(true);
			expect(constraint.verify(new String(""))).to.be(true);
			expect(constraint.verify(1)).to.be(true);
			expect(constraint.verify(new Number(1))).to.be(true);
			expect(constraint.verify(true)).to.be(true);
			expect(constraint.verify(false)).to.be(true);
			expect(constraint.verify(new Boolean(true))).to.be(true);
			expect(constraint.verify([])).to.be(true);
			expect(constraint.verify({})).to.be(true);
			expect(constraint.verify(null)).to.be(true);
			expect(constraint.verify(undefined)).to.be(true);
		});

		it("must return typed constraint", () => {
			const constraint = <ArgumentConstraint<any>><any>isAny(String);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify("")).to.be(true);
			expect(constraint.verify(new String(""))).to.be(true);
			expect(constraint.verify(1)).to.be(false);
			expect(constraint.verify(new Number(1))).to.be(false);
			expect(constraint.verify(false)).to.be(false);
			expect(constraint.verify(false)).to.be(false);
			expect(constraint.verify(new Boolean(false))).to.be(false);
			expect(constraint.verify([])).to.be(false);
			expect(constraint.verify({})).to.be(false);
			expect(constraint.verify(null)).to.be(false);
			expect(constraint.verify(undefined)).to.be(false);
		});

	});

	describe("isSome", () => {

		it("must return strict constraint if no arguments", () => {
			const constraint = <ArgumentConstraint<any>>isSome(x => false);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify("")).to.be(false);
			expect(constraint.verify(new String(""))).to.be(false);
			expect(constraint.verify(1)).to.be(false);
			expect(constraint.verify(new Number(1))).to.be(false);
			expect(constraint.verify(true)).to.be(false);
			expect(constraint.verify(false)).to.be(false);
			expect(constraint.verify(new Boolean(true))).to.be(false);
			expect(constraint.verify([])).to.be(false);
			expect(constraint.verify({})).to.be(false);
			expect(constraint.verify(null)).to.be(false);
			expect(constraint.verify(undefined)).to.be(false);
		});

		it("must return typed constraint", () => {
			const constraint = <ArgumentConstraint<any>><any>isSome(String, x => false);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify("")).to.be(false);
			expect(constraint.verify(new String(""))).to.be(false);
			expect(constraint.verify(1)).to.be(false);
			expect(constraint.verify(new Number(1))).to.be(false);
			expect(constraint.verify(false)).to.be(false);
			expect(constraint.verify(false)).to.be(false);
			expect(constraint.verify(new Boolean(false))).to.be(false);
			expect(constraint.verify([])).to.be(false);
			expect(constraint.verify({})).to.be(false);
			expect(constraint.verify(null)).to.be(false);
			expect(constraint.verify(undefined)).to.be(false);
		});

	});

	describe("isAnyArray", () => {

		it("must return empty constraint if no arguments", () => {
			const constraint = <ArrayArgumentConstraint<any>><any>isAnyArray();

			expect(constraint).to.be.an(ArrayArgumentConstraint);
			expect(constraint.isStrict()).to.be(false);
			expect(constraint.verify([])).to.be(true);
			expect(constraint.verify(new Array())).to.be(true);
			expect(constraint.verify([1, 2, 3])).to.be(true);
			expect(constraint.verify(["a", "b", "c"])).to.be(true);
		});

		it("must return typed constraint", () => {
			const constraint = <ArrayArgumentConstraint<any>><any>isAnyArray(Number);

			expect(constraint).to.be.an(ArrayArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify([])).to.be(true);
			expect(constraint.verify([1, 2, 3])).to.be(true);
			expect(constraint.verify(<any>["a", "b", "c"])).to.be(false);
			expect(constraint.verify(<any>[1, 2, "c"])).to.be(false);
		});

	});

	describe("isSomeArray", () => {

		it("must return strict constraint if no arguments", () => {
			const constraint = <ArrayArgumentConstraint<any>><any>isSomeArray(x => x instanceof Array);

			expect(constraint).to.be.an(ArrayArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify([])).to.be(true);
			expect(constraint.verify(new Array())).to.be(true);
			expect(constraint.verify([1, 2, 3])).to.be(true);
			expect(constraint.verify(["a", "b", "c"])).to.be(true);
		});

		it("must return typed constraint", () => {
			const constraint = <ArrayArgumentConstraint<any>><any>isSomeArray(Number, x => x instanceof Array);

			expect(constraint).to.be.an(ArrayArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify([])).to.be(true);
			expect(constraint.verify([1, 2, 3])).to.be(true);
			expect(constraint.verify(<any>["a", "b", "c"])).to.be(false);
			expect(constraint.verify(<any>[1, 2, "c"])).to.be(false);
		});

	});

	describe("isArrayOfSome", () => {

		it("must return strict constraint if no arguments", () => {
			const constraint = <ArrayArgumentConstraint<any>><any>isArrayOfSome(x => !(x instanceof Array));

			expect(constraint).to.be.an(ArrayArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify([])).to.be(true);
			expect(constraint.verify(new Array())).to.be(true);
			expect(constraint.verify([1, 2, 3])).to.be(true);
			expect(constraint.verify(["a", "b", "c"])).to.be(true);
		});

		it("must return typed constraint", () => {
			const constraint = <ArrayArgumentConstraint<any>><any>isArrayOfSome(Number, x => !(x instanceof Array));

			expect(constraint).to.be.an(ArrayArgumentConstraint);
			expect(constraint.isStrict()).to.be(true);
			expect(constraint.verify([])).to.be(true);
			expect(constraint.verify([1, 2, 3])).to.be(true);
			expect(constraint.verify(<any>["a", "b", "c"])).to.be(false);
			expect(constraint.verify(<any>[1, 2, "c"])).to.be(false);
		});

	});

	describe("isInRange", () => {

		it("must match numbers only", () => {
			const constraint = <ArgumentConstraint<any>><any>isInRange(0, 5);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.verify(null)).to.be(false);
			expect(constraint.verify([])).to.be(false);
			expect(constraint.verify(1)).to.be(true);
		});

		it("must be inclusive by default", () => {
			const constraint = <ArgumentConstraint<number>><any>isInRange(0, 2);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.verify(-100)).to.be(false);
			expect(constraint.verify(-1)).to.be(false);
			expect(constraint.verify(0)).to.be(true);
			expect(constraint.verify(1)).to.be(true);
			expect(constraint.verify(2)).to.be(true);
			expect(constraint.verify(3)).to.be(false);
			expect(constraint.verify(100)).to.be(false);
		});

		it("must be inclusive if set", () => {
			const constraint = <ArgumentConstraint<number>><any>isInRange(0, 2, true);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.verify(-100)).to.be(false);
			expect(constraint.verify(-1)).to.be(false);
			expect(constraint.verify(0)).to.be(true);
			expect(constraint.verify(1)).to.be(true);
			expect(constraint.verify(2)).to.be(true);
			expect(constraint.verify(3)).to.be(false);
			expect(constraint.verify(100)).to.be(false);
		});

		it("must be exclusive if set", () => {
			const constraint = <ArgumentConstraint<number>><any>isInRange(0, 2, false);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.verify(-100)).to.be(false);
			expect(constraint.verify(-1)).to.be(false);
			expect(constraint.verify(0)).to.be(false);
			expect(constraint.verify(1)).to.be(true);
			expect(constraint.verify(2)).to.be(false);
			expect(constraint.verify(3)).to.be(false);
			expect(constraint.verify(100)).to.be(false);
		});

	});

	describe("isOneOf", () => {

		it("must match if in list", () => {
			const constraint = <ArgumentConstraint<any>><any>isOneOf([0, 1, 2]);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.verify(null)).to.be(false);
			expect(constraint.verify("")).to.be(false);
			expect(constraint.verify(-1)).to.be(false);
			expect(constraint.verify(0)).to.be(true);
			expect(constraint.verify(1)).to.be(true);
			expect(constraint.verify(2)).to.be(true);
			expect(constraint.verify(3)).to.be(false);
		});

	});

	describe("isNotOneOf", () => {

		it("must not match if in list", () => {
			const constraint = <ArgumentConstraint<any>><any>isNotOneOf([0, 1, 2]);

			expect(constraint).to.be.an(ArgumentConstraint);
			expect(constraint.verify(null)).to.be(true);
			expect(constraint.verify("")).to.be(true);
			expect(constraint.verify(-1)).to.be(true);
			expect(constraint.verify(0)).to.be(false);
			expect(constraint.verify(1)).to.be(false);
			expect(constraint.verify(2)).to.be(false);
			expect(constraint.verify(3)).to.be(true);
		});

	});

});