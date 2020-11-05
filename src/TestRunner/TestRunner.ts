/* eslint-disable no-var */
import { expect, assert } from 'chai';
import Manager from '../Deploy/CreateManager';
import Mocha from 'mocha';
import { testConfig } from '../config/config';
declare global {
  var Manager;
  var expect;
  var assert;
}

export const TestRun = async (config: testConfig) => {
  SetTestGlobal();
  const mocha = CreateMocha(config);
  config.testingFiles.forEach((file) => {
    mocha.addFile(file);
  });
  mocha.run(function (failures) {
    process.exit(failures ? 1 : 0);
  });
};

export const SetTestGlobal = () => {
  global.expect = expect;
  global.assert = assert;
  global.Manager = Manager;
};

export const CreateMocha = (config: testConfig): Mocha => {
  const mochaConfig = config.mocha || {};
  // Propagate --bail option to mocha
  mochaConfig.bail = config.bail;

  // If the command line overrides color usage, use that.
  if (config.colors != null) {
    mochaConfig.color = config.colors;
  }
  // Default to true if configuration isn't set anywhere.
  if (mochaConfig.color == null) {
    mochaConfig.color = true;
  }
  mochaConfig.timeout = config.timeout;
  const mocha = new Mocha(mochaConfig);

  return mocha;
};