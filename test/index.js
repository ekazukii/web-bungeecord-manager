const assert = require('assert').strict;
describe("Integration test", function() {
    it("Should be able to calculate 1+1=2", function() {
        assert.strictEqual(1+1, 2);
    });

    it("Should be true", function() {
        assert.ok(true)
    });

    it("Should also be true", function() {
        assert.ok(true)
    });
});