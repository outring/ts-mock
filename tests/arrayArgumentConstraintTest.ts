import expect = require("expect.js");
import {ArrayArgumentConstraint, ArgumentConstraint} from "../src/argumentConstraint";

describe("ArrayArgumentConstraint", () => {

	it("must be loose if has no generic constraint", () => {
		const constraint = new ArrayArgumentConstraint();

		expect(constraint.isStrict()).to.be(false);
	});

	it("must be strict if has generic constraint", () => {
		const constraint = new ArrayArgumentConstraint(null, () => true);

		expect(constraint.isStrict()).to.be(true);
	});

	it("must be loose if element constraint is loose", () => {
		const constraint = new ArrayArgumentConstraint(new ArgumentConstraint(null));

		expect(constraint.isStrict()).to.be(false);
	});

	it("must be strict if element constraint is strict", () => {
		const constraint = new ArrayArgumentConstraint(new ArgumentConstraint(String));

		expect(constraint.isStrict()).to.be(true);
	});

	it("must not verify if not array", () => {
		const constraint = new ArrayArgumentConstraint();

		expect(constraint.verify(<any>"")).to.be(false);
		expect(constraint.verify(<any>new String(""))).to.be(false);
		expect(constraint.verify(<any>1)).to.be(false);
		expect(constraint.verify(<any>new Number(1))).to.be(false);
		expect(constraint.verify(<any>true)).to.be(false);
		expect(constraint.verify(<any>false)).to.be(false);
		expect(constraint.verify(<any>new Boolean(false))).to.be(false);
		expect(constraint.verify(<any>{})).to.be(false);
		expect(constraint.verify(<any>null)).to.be(false);
		expect(constraint.verify(<any>undefined)).to.be(false);
	});

	it("must verify if no element type", () => {
		const constraint = new ArrayArgumentConstraint();

		expect(constraint.verify([])).to.be(true);
		expect(constraint.verify(new Array())).to.be(true);
		expect(constraint.verify([1, 2, 3])).to.be(true);
		expect(constraint.verify(["a", "b", "c"])).to.be(true);
	});

	it("must verify element constraint", () => {
		const constraint = new ArrayArgumentConstraint(new ArgumentConstraint(Number));

		expect(constraint.verify([])).to.be(true);
		expect(constraint.verify([1, 2, 3])).to.be(true);
		expect(constraint.verify(<any>["a", "b", "c"])).to.be(false);
		expect(constraint.verify(<any>[1, 2, "c"])).to.be(false);
	});

	describe("must verify generic constraint", () => {

		it("and return value", () => {
			expect(new ArrayArgumentConstraint(null, () => true).verify([1, 2, 3])).to.be(true);
			expect(new ArrayArgumentConstraint(null, () => false).verify([1, 2, 3])).to.be(false);
		});

		it("and check argument", () => {
			const constraint = new ArrayArgumentConstraint(null, x => x.length === 1);

			expect(constraint.verify([1])).to.be(true);
			expect(constraint.verify([1, 2])).to.be(false);
		});

		it("after type check", () => {
			const constraint = new ArrayArgumentConstraint(new ArgumentConstraint(String), x => <any>x === 1);

			expect(constraint.verify(<any>[1, 2, 3])).to.be(false);
		});

	});

});