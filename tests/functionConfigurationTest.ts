import expect = require("expect.js");
import {FunctionConfiguration, createFunctionConfigurationCreator} from "../src/functionConfiguration.ts";
import {ArgumentConstraint} from "../src/argumentConstraint";

describe("FunctionConfiguration", () => {

	describe("getName", () => {

		it("must return name", () => {
			const configuration = new FunctionConfiguration<void>("test", []);

			expect(configuration.getName()).to.be("test");
		});

	});

	describe("getSpecificity", () => {

		it("must be zero if no args", () => {
			const configuration = new FunctionConfiguration<void>("test", []);

			expect(configuration.getSpecificity()).to.be(0);
		});

		it("must be equal to number of args", () => {
			const configuration1 = new FunctionConfiguration<void>("test", [1, 2, 3, 4]);
			const configuration2 = new FunctionConfiguration<void>("test", [1, 2]);

			expect(configuration1.getSpecificity()).to.be(4);
			expect(configuration2.getSpecificity()).to.be(2);
		});

		it("must be equal to number of non-constraint args", () => {
			const args1 = [new ArgumentConstraint(null), 1, 2, new ArgumentConstraint(null), 3, 4, new ArgumentConstraint(null)];
			const args2 = [new ArgumentConstraint(null), 1, new ArgumentConstraint(null), 2, new ArgumentConstraint(null)];
			const configuration1 = new FunctionConfiguration<void>("test", args1);
			const configuration2 = new FunctionConfiguration<void>("test", args2);

			expect(configuration1.getSpecificity()).to.be(4);
			expect(configuration2.getSpecificity()).to.be(2);
		});

		it("must be equal to number of non-constraint or strict constraint args", () => {
			const args1 = [new ArgumentConstraint(null, () => null), 1, 2, new ArgumentConstraint(null, () => null), 3, 4, new ArgumentConstraint(String)];
			const args2 = [new ArgumentConstraint(null, () => null), 1, new ArgumentConstraint(null, () => null), 2, new ArgumentConstraint(String)];
			const configuration1 = new FunctionConfiguration<void>("test", args1);
			const configuration2 = new FunctionConfiguration<void>("test", args2);

			expect(configuration1.getSpecificity()).to.be(7);
			expect(configuration2.getSpecificity()).to.be(5);
		});

	});

	describe("isSuitable", () => {

		it("must be true if no args", () => {
			const configuration = new FunctionConfiguration<void>("test", []);

			expect(configuration.isSuitable([])).to.be(true);
		});

		it("must be false if args count differs", () => {
			const configuration = new FunctionConfiguration<void>("test", [1]);

			expect(configuration.isSuitable([])).to.be(false);
		});

		it("must be true if args match", () => {
			const configuration = new FunctionConfiguration<void>("test", [1, 2, 3, 4]);

			expect(configuration.isSuitable([1, 2, 3, 4])).to.be(true);
		});

		it("must be false if args differ", () => {
			const configuration = new FunctionConfiguration<void>("test", [1, 2, 3, 4]);

			expect(configuration.isSuitable([4, 3, 2, 1])).to.be(false);
		});

		it("must match constraints", () => {
			const args = [new ArgumentConstraint(null), new ArgumentConstraint(null), new ArgumentConstraint(null), new ArgumentConstraint(null)];
			const configuration = new FunctionConfiguration<void>("test", args);

			expect(configuration.isSuitable([1, 2, 3, 4])).to.be(true);
			expect(configuration.isSuitable([4, 3, 2, 1])).to.be(true);
		});

		it("must match constraints with types", () => {
			const args = [new ArgumentConstraint(String), new ArgumentConstraint(Number)];
			const configuration = new FunctionConfiguration<void>("test", args);

			expect(configuration.isSuitable(["test", 1])).to.be(true);
			expect(configuration.isSuitable([1, "test"])).to.be(false);
		});

		it("must match strict constraints", () => {
			const args = [new ArgumentConstraint(String, x => x === "test")];
			const configuration = new FunctionConfiguration<void>("test", args);

			expect(configuration.isSuitable(["test"])).to.be(true);
			expect(configuration.isSuitable(["test1"])).to.be(false);
		});

	});

	describe("execute", () => {

		it("returns nothing if not set up", () => {
			const configuration = new FunctionConfiguration<void>("test", []);

			expect(configuration.execute([])).to.be(undefined);
		});

	});

	describe("callback", () => {

		it("must be called with execute", () => {
			let isCallbackCalled = false;
			const callback = () => isCallbackCalled = true;
			const configuration = new FunctionConfiguration<void>("test", []);

			configuration.callback(callback);
			configuration.execute([]);

			expect(isCallbackCalled).to.be(true);
		});

		it("must receive args passed", () => {
			let args:number[];
			const callback = (first:number, second:number, third:number) => args = [first, second, third];
			const configuration = new FunctionConfiguration<void>("test", []);

			configuration.callback(callback);
			configuration.execute([1, 2, 3]);

			expect(args).to.eql([1, 2, 3]);
		});

		it("must be chained and set all callbacks", () => {
			let isCallback1Called = false;
			let isCallback2Called = false;
			const callback1 = () => isCallback1Called = true;
			const callback2 = () => isCallback2Called = true;
			const configuration = new FunctionConfiguration<void>("test", []);

			configuration.callback(callback1).callback(callback2);
			configuration.execute([]);

			expect(isCallback1Called).to.be(true);
			expect(isCallback2Called).to.be(true);
		});

	});

	describe("returns", () => {

		it("must return passed value", () => {
			const configuration = new FunctionConfiguration<number>("test", []);

			configuration.returns(() => 1);

			expect(configuration.execute([])).to.be(1);
		});

		it("must return value from callback", () => {
			const callback = () => 1;
			const configuration = new FunctionConfiguration<number>("test", []);

			configuration.returns(callback);

			expect(configuration.execute([])).to.be(1);
		});

		it("must receive args passed", () => {
			const callback = (first:number, second:number, third:number) => [first, second, third];
			const configuration = new FunctionConfiguration<number[]>("test", []);

			configuration.returns(callback);

			expect(configuration.execute([1, 2, 3])).to.eql([1, 2, 3]);
		});

		it("must not allow multiple configurations", () => {
			const callback = (first:number, second:number, third:number) => [first, second, third];
			const configuration = new FunctionConfiguration<number[]>("test1", []);

			configuration.returns(callback);

			expect(() => configuration.returns(callback)).to.throwError(/Function test1 call is already configured/);
			expect(() => configuration.throws(() => new Error("Test error"))).to.throwError(/Function test1 call is already configured/);
		});

	});

	describe("throws", () => {

		it("must throw on execution", () => {
			const configuration = new FunctionConfiguration<number[]>("test1", []);

			configuration.throws(() => new Error("Test error"));

			expect(() => configuration.execute([])).to.throwError(/Test error/);
		});

		it("must receive args passed", () => {
			const callback = (first:number, second:number, third:number) => new Error([first, second, third].join(""));
			const configuration = new FunctionConfiguration<number[]>("test", []);

			configuration.throws(callback);

			expect(() => configuration.execute([1, 2, 3])).to.throwError(/123/);
		});

		it("must not allow multiple configurations", () => {
			const configuration = new FunctionConfiguration<number[]>("test1", []);

			configuration.throws(() => new Error("Test error"));

			expect(() => configuration.throws(() => new Error("Test error"))).to.throwError(/Function test1 call is already configured/);
			expect(() => configuration.returns(() => [])).to.throwError(/Function test1 call is already configured/);
		});

	});

	describe("onCall", () => {

		it("default call number must be default", () => {
			const configuration = new FunctionConfiguration<number[]>("test1", []);

			expect(configuration.getCallNumber()).to.be(-1);
		});

		it("must set call number", () => {
			const configuration = new FunctionConfiguration<number[]>("test1", []);

			configuration.onCall(1);

			expect(configuration.getCallNumber()).to.be(1);
		});

		it("must set call number only once", () => {
			const configuration = new FunctionConfiguration<number[]>("test1", []);

			configuration.onCall(1);

			expect(() => configuration.onCall(1)).to.throwError(/Function test1 call number is already configured/);
		});

	});

});

describe("createFunctionConfigurationCreator", () => {

	it("returns creator", () => {
		const creator = createFunctionConfigurationCreator("method");
		const configuration = creator(1, 2, 3);

		expect(configuration).to.be.a(FunctionConfiguration);
		expect(configuration.getName()).to.be("method");
		expect(configuration.isSuitable([1, 2, 3])).to.be(true);
		expect(configuration.isSuitable([4, 5, 6])).to.be(false);
	});

});