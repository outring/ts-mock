import expect = require("expect.js");
import {ArgumentConstraint} from "../src/argumentConstraint";

class TestType {

}

describe("ArgumentConstraint", () => {

	it("must be loose if has no generic constraint", () => {
		const constraint = new ArgumentConstraint(null);

		expect(constraint.isStrict()).to.be(false);
	});

	it("must be strict if has generic constraint", () => {
		const constraint = new ArgumentConstraint(null, () => true);

		expect(constraint.isStrict()).to.be(true);
	});

	it("must be strict if has type constraint", () => {
		const constraint = new ArgumentConstraint(String);

		expect(constraint.isStrict()).to.be(true);
	});

	it("must verify anything if no constraints", () => {
		const constraint = new ArgumentConstraint(null);

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

	describe("must verify argument type", () => {

		it("if string", () => {
			const constraint = new ArgumentConstraint(String);

			expect(constraint.verify("")).to.be(true);
			expect(constraint.verify(new String(""))).to.be(true);
			expect(constraint.verify(<any>1)).to.be(false);
			expect(constraint.verify(<any>new Number(1))).to.be(false);
			expect(constraint.verify(<any>true)).to.be(false);
			expect(constraint.verify(<any>false)).to.be(false);
			expect(constraint.verify(<any>new Boolean(true))).to.be(false);
			expect(constraint.verify(<any>[])).to.be(false);
			expect(constraint.verify(<any>{})).to.be(false);
			expect(constraint.verify(<any>null)).to.be(false);
			expect(constraint.verify(<any>undefined)).to.be(false);
		});

		it("if number", () => {
			const constraint = new ArgumentConstraint(Number);

			expect(constraint.verify(<any>"")).to.be(false);
			expect(constraint.verify(<any>new String(""))).to.be(false);
			expect(constraint.verify(1)).to.be(true);
			expect(constraint.verify(new Number(1))).to.be(true);
			expect(constraint.verify(<any>true)).to.be(false);
			expect(constraint.verify(<any>false)).to.be(false);
			expect(constraint.verify(<any>new Boolean(true))).to.be(false);
			expect(constraint.verify(<any>[])).to.be(false);
			expect(constraint.verify(<any>{})).to.be(false);
			expect(constraint.verify(<any>null)).to.be(false);
			expect(constraint.verify(<any>undefined)).to.be(false);
		});

		it("if boolean", () => {
			const constraint = new ArgumentConstraint(Boolean);

			expect(constraint.verify(<any>"")).to.be(false);
			expect(constraint.verify(<any>new String(""))).to.be(false);
			expect(constraint.verify(<any>1)).to.be(false);
			expect(constraint.verify(<any>new Number(1))).to.be(false);
			expect(constraint.verify(true)).to.be(true);
			expect(constraint.verify(false)).to.be(true);
			expect(constraint.verify(new Boolean(true))).to.be(true);
			expect(constraint.verify(<any>[])).to.be(false);
			expect(constraint.verify(<any>{})).to.be(false);
			expect(constraint.verify(<any>null)).to.be(false);
			expect(constraint.verify(<any>undefined)).to.be(false);
		});

		it("if non-primitive native", () => {
			const arrayConstraint = new ArgumentConstraint(Array);

			expect(arrayConstraint.verify([])).to.be(true);
			expect(arrayConstraint.verify(new Array())).to.be(true);
			expect(arrayConstraint.verify(<any>{})).to.be(false);
			expect(arrayConstraint.verify(<any>"")).to.be(false);

			const objectConstraint = new ArgumentConstraint(Object);

			expect(objectConstraint.verify({})).to.be(true);
			expect(objectConstraint.verify(new Object())).to.be(true);
			expect(objectConstraint.verify(<any>"")).to.be(false);

			const regExpConstraint = new ArgumentConstraint(RegExp);

			expect(regExpConstraint.verify(/x/)).to.be(true);
			expect(regExpConstraint.verify(new RegExp("x"))).to.be(true);
			expect(regExpConstraint.verify(<any>{})).to.be(false);
			expect(regExpConstraint.verify(<any>"")).to.be(false);
		});

		it("if non-primitive", () => {
			const arrayConstraint = new ArgumentConstraint(TestType);

			expect(arrayConstraint.verify(new TestType())).to.be(true);
			expect(arrayConstraint.verify(<any>{})).to.be(false);
			expect(arrayConstraint.verify(<any>"")).to.be(false);
		});

	});

	describe("must verify generic constraint", () => {

		it("and return value", () => {
			expect(new ArgumentConstraint(null, () => true).verify(null)).to.be(true);
			expect(new ArgumentConstraint(null, () => false).verify(null)).to.be(false);
		});

		it("and check argument", () => {
			const constraint = new ArgumentConstraint(null, x => x === 1);

			expect(constraint.verify(1)).to.be(true);
			expect(constraint.verify(2)).to.be(false);
		});

		it("after type check", () => {
			const constraint = new ArgumentConstraint(String, x => <any>x === 1);

			expect(constraint.verify(<any>1)).to.be(false);
		});

	});

});