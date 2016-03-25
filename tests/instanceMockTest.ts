import expect = require("expect.js");
import {Mock} from "../src/mock";
import {isAny} from "../src/it";

class TestCall {

	private _name:string;
	private _args:any[];

	constructor(name:string, args:any[]) {
		this._name = name;
		this._args = args;
	}

	public getName():string {
		return this._name;
	}

	public getArgs():any[] {
		return this._args;
	}

}

class TestClass {

	private _calls:TestCall[] = [];

	public getCalls():TestCall[] {
		return this._calls;
	}

	public noArgsVoidMethod():void {
		this._calls.push(new TestCall("noArgsVoidMethod", []));
	}

	public argsVoidMethod(...args:any[]):void {
		this._calls.push(new TestCall("argsVoidMethod", args));
	}

	public noArgsReturnMethod():string {
		this._calls.push(new TestCall("noArgsReturnMethod", []));
		return "noArgsReturnMethodResult";
	}

	public argsReturnMethod(...args:any[]):string {
		this._calls.push(new TestCall("argsReturnMethod", args));
		return "argsReturnMethodResult";
	}

}

describe("instance Mock", () => {

	it("must call instance methods if not configured", () => {
		const mock = new Mock<TestClass>(new TestClass());
		const testInstance = mock.getObject();

		const noArgsVoidMethodResult = testInstance.noArgsVoidMethod();
		const argsVoidMethodResult = testInstance.argsVoidMethod("voidArg1", "voidArg2");
		const noArgsReturnMethodResult = testInstance.noArgsReturnMethod();
		const argsReturnMethodResult = testInstance.argsReturnMethod("returnArg1", "returnArg2");

		expect(noArgsVoidMethodResult).to.be(undefined);
		expect(argsVoidMethodResult).to.be(undefined);
		expect(noArgsReturnMethodResult).to.be("noArgsReturnMethodResult");
		expect(argsReturnMethodResult).to.be("argsReturnMethodResult");

		expect(testInstance.getCalls()).to.eql([
			new TestCall("noArgsVoidMethod", []),
			new TestCall("argsVoidMethod", ["voidArg1", "voidArg2"]),
			new TestCall("noArgsReturnMethod", []),
			new TestCall("argsReturnMethod", ["returnArg1", "returnArg2"])
		]);
	});

	describe("set up for throw", () => {

		it("must throw", () => {
			const mock = new Mock<TestClass>(new TestClass());
			const testInstance = mock.getObject();

			mock.setup(x => x.noArgsVoidMethod())
				.throws(() => new Error("noArgsVoidMethodError"));

			expect(() => testInstance.noArgsVoidMethod()).to.throwError(/noArgsVoidMethodError/);
		});

		it("must receive arguments", () => {
			const mock = new Mock<TestClass>(new TestClass());
			const testInstance = mock.getObject();

			mock.setup(x => x.argsVoidMethod(isAny(), isAny()))
				.throws<string, string>((arg1, arg2) => new Error("noArgsReturnMethodError" + arg1 + arg2));

			expect(() => testInstance.argsVoidMethod("voidArg1", "voidArg2")).to.throwError(/noArgsReturnMethodErrorvoidArg1voidArg2/);
		});

	});

	it("must return if configured", () => {
		const mock = new Mock<TestClass>(new TestClass());
		const testInstance = mock.getObject();

		mock.setup(x => x.noArgsReturnMethod())
			.returns(() => "noArgsReturnMethodConfiguredResult");

		expect(testInstance.noArgsReturnMethod()).to.be("noArgsReturnMethodConfiguredResult");
	});

});
