const packageJsonDeps = require("./package.json").dependencies;
const { NodeModuleFederation } = require("@telenko/node-mf");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  future: { webpack5: true },
  webpack: (config, options) => {
    const { buildId, dev, isServer, defaultLoaders, webpack } = options;
    const mfConf = {
      remotes: {
        remoteLib: isServer ? "remoteLib@http://localhost:3002/remoteEntry.node.js" : "remoteLib@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: {
          eager: true,
          requiredVersion: packageJsonDeps["react"],
          singleton: true,
        },
        "react-dom": {
          eager: true,
          requiredVersion: packageJsonDeps["react-dom"],
          singleton: true,
        },
      },
    };
    return {
      ...config,
      plugins: [
        ...config.plugins,
        new (isServer ? NodeModuleFederation : ModuleFederationPlugin)(mfConf)
      ],
      experiments: { topLevelAwait: true },
    };
  },

  webpackDevMiddleware: (config) => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config;
  },
};
