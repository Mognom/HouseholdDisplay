/* globals MashupPlatform, MockMP, HouseholdDisplay */

(function () {

    "use strict";

    describe("HouseholdDisplay", function () {

        var widget;

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'widget'
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            widget = new HouseholdDisplay();
        });

        it("Dummy test", function () {
            expect(widget).not.toBe(null);
        });

    });

})();
