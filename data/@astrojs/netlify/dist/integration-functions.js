import { createRedirects } from "./shared.js";
function getAdapter(args = {}) {
  return {
    name: "@astrojs/netlify/functions",
    serverEntrypoint: "@astrojs/netlify/netlify-functions.js",
    exports: ["handler"],
    args
  };
}
function netlifyFunctions({
  dist,
  binaryMediaTypes
} = {}) {
  let _config;
  let entryFile;
  return {
    name: "@astrojs/netlify",
    hooks: {
      "astro:config:setup": ({ config }) => {
        if (dist) {
          config.outDir = dist;
        } else {
          config.outDir = new URL("./dist/", config.root);
        }
      },
      "astro:config:done": ({ config, setAdapter }) => {
        setAdapter(getAdapter({ binaryMediaTypes }));
        _config = config;
        if (config.output === "static") {
          console.warn(`[@astrojs/netlify] \`output: "server"\` is required to use this adapter.`);
          console.warn(
            `[@astrojs/netlify] Otherwise, this adapter is not required to deploy a static site to Netlify.`
          );
        }
      },
      "astro:build:start": async ({ buildConfig }) => {
        entryFile = buildConfig.serverEntry.replace(/\.m?js/, "");
        buildConfig.client = _config.outDir;
        buildConfig.server = new URL("./.netlify/functions-internal/", _config.root);
      },
      "astro:build:done": async ({ routes, dir }) => {
        await createRedirects(routes, dir, entryFile, false);
      }
    }
  };
}
export {
  netlifyFunctions as default,
  getAdapter,
  netlifyFunctions
};
