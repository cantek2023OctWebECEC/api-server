// tests/calculator.spec.tx
import { expect } from "chai";
// Arrange Act Assert
describe("Dummy test", () => {
	it("should return true", (done) => {
		const expected = true;
		const result = true;
		expect(result).equal(expected);
		done();
	});
	it("should return false", (done) => {
		const expected = false;
		const result = true;
		expect(result).not.equal(expected);
		done();
	});
});
