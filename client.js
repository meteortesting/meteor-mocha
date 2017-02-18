import './browser-shim.js';
import { mocha } from 'meteor/practicalmeteor:mocha-core';
import './lib/collections';


// Run the client tests. Meteor calls the `runTests` function exported by
// the driver package on the client.
function runTests() {
  // We need to set the reporter when the tests actually run. This ensures that the
  // correct reporter is used in the case where `dispatch:mocha-browser` is also
  // added to the app. Since both are testOnly packages, top-level client code in both
  // will run, potentially changing the reporter.
  Meteor.subscribe("runtimeArgs", {
    onReady: function () {

    var runtimeArgs = RuntimeArgs.findOne()
    if (runtimeArgs.mochaOptions.grep) { mocha.grep(runtimeArgs.mochaOptions.grep) }
    if (runtimeArgs.mochaOptions.invert) { mocha.options.invert = runtimeArgs.mochaOptions.invert }

    mocha.reporter(Meteor.settings.public.CLIENT_TEST_REPORTER || 'spec');

    // These `window` properties are all used by the client testing script in the
    // browser-tests package to know what is happening.
    window.testsAreRunning = true;
    mocha.run(failures => {
      window.testsAreRunning = false;
      window.testFailures = failures;
      window.testsDone = true;
    });//

   },
    onError: function () { console.log("onError runtimeArgs"); }
  });


}

export { runTests };
