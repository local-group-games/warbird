const path = require("path");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

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
