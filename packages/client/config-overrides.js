const path = require("path");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

const makeMonorepoPackageAliases = dependencyNames =>
  dependencyNames.reduce((acc, dependencyName) => {
    return {
      [dependencyName]: path.resolve(
        `../../node_modules/${dependencyName}/src`,
      ),
      ...acc,
    };
  }, {});

const localPackages = ["colyseus-test-core"];

module.exports = function override(config) {
  Object.assign(config.resolve.alias, {
    three$: path.resolve("./src/exports/three.ts"),
    // ...makeMonorepoPackageAliases(localPackages),
  });

  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => !(plugin instanceof ModuleScopePlugin),
  );

  return config;
};
