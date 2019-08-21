const path = require("path");

const buildLocalSrcAliases = dependencyNames =>
  dependencyNames.reduce((acc, dependencyName) => {
    return {
      [dependencyName]: path.resolve(`./node_modules/${dependencyName}/src`),
      ...acc,
    };
  }, {});

const localPackages = ["colyseus-test-core"];

module.exports = function override(config) {
  Object.assign(config.resolve.alias, {
    three$: path.resolve("./src/exports/three.ts"),
    ...buildLocalSrcAliases(localPackages),
  });

  return config;
};
