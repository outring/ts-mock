import expect = require("expect.js");
import {FunctionProxyDescriptor, createFunctionProxy} from "../src/functionProxy";
import {FunctionConfiguration} from "../src/functionConfiguration";
import {isAny} from "../src/it";

describe("FunctionProxyDescriptor", () => {

	describe("getName", () => {

		it("must return name", () => {
			const descriptor = new FunctionProxyDescriptor("test", () => {});

			expect(descriptor.getName()).to.be("test");
		});

	});

	describe("getCalls", () => {

		it("must return empty array if no calls", () => {
			const descriptor = new FunctionProxyDescriptor("test", () => {});

			expect(descriptor.getCalls()).to.eql([]);
		});

		it("must return all calls", () => {
			const descriptor = new FunctionProxyDescriptor("test", () => {});

			descriptor.execute(null, []);
			descriptor.execute(null, [1, 2, 3]);
			descriptor.execute(null, ["test1", "test2", "test3"]);

			const calls = descriptor.getCalls();
			expect(calls.length).to.be(3);
			expect(calls[0].getNumber()).to.be(0);
			expect(calls[0].getArgs()).to.eql([]);
			expect(calls[1].getNumber()).to.be(1);
			expect(calls[1].getArgs()).to.eql([1, 2, 3]);
			expect(calls[2].getNumber()).to.be(2);
			expect(calls[2].getArgs()).to.eql(["test1", "test2", "test3"]);
		});

	});

	describe("execute", () => {

		it("must call fallback if no configurations", () => {
			let isFallbackCalled = false;
			const descriptor = new FunctionProxyDescriptor("test", () => isFallbackCalled = true);

			descriptor.execute(null, []);

			expect(isFallbackCalled).to.be(true);
		});

		it("must call fallback if no suitable configuration", () => {
			let isFallbackCalled = false;
			const descriptor = new FunctionProxyDescriptor("test", () => isFallbackCalled = true);
			const configuration = new FunctionConfiguration("test", [4, 5, 6]);
			descriptor.addConfiguration(configuration);

			descriptor.execute(null, [1, 2, 3]);

			expect(isFallbackCalled).to.be(true);
		});

		it("must not call configuration callback if no suitable configuration", () => {
			let isCallbackCalled = false;
			const descriptor = new FunctionProxyDescriptor("test", () => {});
			const configuration = new FunctionConfiguration("test", [4, 5, 6]);
			configuration.callback(() => isCallbackCalled = true);
			descriptor.addConfiguration(configuration);

			descriptor.execute(null, [1, 2, 3]);

			expect(isCallbackCalled).to.be(false);
		});

		it("must call default configuration if no call configuration", () => {
			let isCallbackCalled = false;
			const descriptor = new FunctionProxyDescriptor("test", () => {});
			const configuration = new FunctionConfiguration("test", []);
			configuration.callback(() => isCallbackCalled = true);
			descriptor.addConfiguration(configuration);

			descriptor.execute(null, []);

			expect(isCallbackCalled).to.be(true);
		});

		it("must call configuration if set", () => {
			let isDefaultCallbackCalled = false;
			let isCallCallbackCalled = false;
			const descriptor = new FunctionProxyDescriptor("test", () => {});
			const defaultConfiguration = new FunctionConfiguration("test", []);
			defaultConfiguration.callback(() => isDefaultCallbackCalled = true);
			descriptor.addConfiguration(defaultConfiguration);
			const callConfiguration = new FunctionConfiguration("test", []);
			callConfiguration.onCall(0).callback(() => isCallCallbackCalled = true);
			descriptor.addConfiguration(callConfiguration);

			descriptor.execute(null, []);

			expect(isDefaultCallbackCalled).to.be(false);
			expect(isCallCallbackCalled).to.be(true);
		});

		it("must call most specific configuration", () => {
			let isCallback1Called = false;
			let isCallback2Called = false;
			let isCallback3Called = false;
			const descriptor = new FunctionProxyDescriptor("test", () => {});
			const configuration1 = new FunctionConfiguration("test", [isAny(), 2, isAny()]);
			configuration1.callback(() => isCallback1Called = true);
			descriptor.addConfiguration(configuration1);
			const configuration2 = new FunctionConfiguration("test", [1, 2, 3]);
			configuration2.callback(() => isCallback2Called = true);
			descriptor.addConfiguration(configuration2);
			const configuration3 = new FunctionConfiguration("test", [1, isAny(Number), isAny()]);
			configuration3.callback(() => isCallback3Called = true);
			descriptor.addConfiguration(configuration3);

			descriptor.execute(null, [1, 2, 3]);

			expect(isCallback1Called).to.be(false);
			expect(isCallback2Called).to.be(true);
			expect(isCallback3Called).to.be(false);
		});

		it("must call most specific suitable configuration", () => {
			let isCallback1Called = false;
			let isCallback2Called = false;
			let isCallback3Called = false;
			const descriptor = new FunctionProxyDescriptor("test", () => {});
			const configuration1 = new FunctionConfiguration("test", [isAny(), 2, isAny()]);
			configuration1.callback(() => isCallback1Called = true);
			descriptor.addConfiguration(configuration1);
			const configuration2 = new FunctionConfiguration("test", ["test1", "test2", "test3"]);
			configuration2.callback(() => isCallback2Called = true);
			descriptor.addConfiguration(configuration2);
			const configuration3 = new FunctionConfiguration("test", [1, isAny(Number), isAny()]);
			configuration3.callback(() => isCallback3Called = true);
			descriptor.addConfiguration(configuration3);

			descriptor.execute(null, [1, 2, 3]);

			expect(isCallback1Called).to.be(false);
			expect(isCallback2Called).to.be(false);
			expect(isCallback3Called).to.be(true);
		});

	});

});

describe("createFunctionProxy", () => {

	it("creates function with descriptor attached", () => {
		const proxy = createFunctionProxy("test", () => {});

		expect(proxy).to.be.a(Function);
		expect(proxy.descriptor).to.be.a(FunctionProxyDescriptor);
	});

	it("passes name and fallback to descriptor", () => {
		let isFallbackCalled = false;
		const proxy = createFunctionProxy("test", () => isFallbackCalled = true);

		proxy();

		expect(proxy.descriptor.getName()).to.be("test");
		expect(isFallbackCalled).to.be(true);
	});

	it("forwards calls to descriptor", () => {
		const proxy = createFunctionProxy("test", () => {});

		proxy(1, 2, 3);
		proxy(4, 5, 6);

		const calls = proxy.descriptor.getCalls();
		expect(calls.length).to.be(2);
		expect(calls[0].getArgs()).to.eql([1, 2, 3]);
		expect(calls[1].getArgs()).to.eql([4, 5, 6]);
	});

});