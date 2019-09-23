const path = require("path");
const { addWebpackAlias, babelInclude, override } = require("customize-cra");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const resolvePackageDirectory = package =>
  path.dirname(require.resolve(`${package}/package.json`));
const monorepoPackages = [
  "colyseus-test-core",
  "colyseus-test-ui",
  "colyseus-test-utils",
  "colyseus-test-ecs",
];
const monorepoWebpackAliases = monorepoPackages.reduce((acc, packageName) => {
  acc[packageName] = `${resolvePackageDirectory(packageName)}/src`;
  return acc;
}, {});

module.exports = config => {
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => !(plugin instanceof ModuleScopePlugin),
  );

  return override(
    addWebpackAlias({
      three$: path.resolve("./src/exports/three.ts"),
    }),
    process.env.NODE_ENV === "development" &&
      babelInclude(
        Object.values(monorepoWebpackAliases).concat(path.resolve("src")),
      ),
    process.env.NODE_ENV === "development" &&
      addWebpackAlias(monorepoWebpackAliases),
  )(config);
};
