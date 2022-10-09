import esbuild from "esbuild";
import * as fs from "fs";
import * as npath from "path";
import { fileURLToPath } from "url";
import { createRedirects } from "./shared.js";
const SHIM = `globalThis.process = {
	argv: [],
	env: {},
};`;
function getAdapter() {
  return {
    name: "@astrojs/netlify/edge-functions",
    serverEntrypoint: "@astrojs/netlify/netlify-edge-functions.js",
    exports: ["default"]
  };
}
async function createEdgeManifest(routes, entryFile, dir) {
  const functions = [];
  for (const route of routes) {
    if (route.pathname) {
      functions.push({
        function: entryFile,
        path: route.pathname
      });
    } else {
      functions.push({
        function: entryFile,
        pattern: route.pattern.toString()
      });
    }
  }
  const manifest = {
    functions,
    version: 1
  };
  const baseDir = new URL("./.netlify/edge-functions/", dir);
  await fs.promises.mkdir(baseDir, { recursive: true });
  const manifestURL = new URL("./manifest.json", baseDir);
  const _manifest = JSON.stringify(manifest, null, "  ");
  await fs.promises.writeFile(manifestURL, _manifest, "utf-8");
}
async function bundleServerEntry(buildConfig, vite) {
  var _a, _b, _c;
  const entryUrl = new URL(buildConfig.serverEntry, buildConfig.server);
  const pth = fileURLToPath(entryUrl);
  await esbuild.build({
    target: "es2020",
    platform: "browser",
    entryPoints: [pth],
    outfile: pth,
    allowOverwrite: true,
    format: "esm",
    bundle: true,
    external: ["@astrojs/markdown-remark"],
    banner: {
      js: SHIM
    }
  });
  try {
    const chunkFileNames = ((_c = (_b = (_a = vite == null ? void 0 : vite.build) == null ? void 0 : _a.rollupOptions) == null ? void 0 : _b.output) == null ? void 0 : _c.chunkFileNames) ?? "chunks/chunk.[hash].mjs";
    const chunkPath = npath.dirname(chunkFileNames);
    const chunksDirUrl = new URL(chunkPath + "/", buildConfig.server);
    await fs.promises.rm(chunksDirUrl, { recursive: true, force: true });
  } catch {
  }
}
function netlifyEdgeFunctions({ dist } = {}) {
  let _config;
  let entryFile;
  let _buildConfig;
  let _vite;
  return {
    name: "@astrojs/netlify/edge-functions",
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        if (dist) {
          config.outDir = dist;
        } else {
          config.outDir = new URL("./dist/", config.root);
        }
        const injectPlugin = {
          name: "@astrojs/netlify/plugin-inject",
          generateBundle(_options, bundle) {
            if (_buildConfig.serverEntry in bundle) {
              const chunk = bundle[_buildConfig.serverEntry];
              if (chunk && chunk.type === "chunk") {
                chunk.code = `globalThis.process = { argv: [], env: {}, };${chunk.code}`;
              }
            }
          }
        };
        updateConfig({
          vite: {
            plugins: [injectPlugin]
          }
        });
      },
      "astro:config:done": ({ config, setAdapter }) => {
        setAdapter(getAdapter());
        _config = config;
        if (config.output === "static") {
          console.warn(`[@astrojs/netlify] \`output: "server"\` is required to use this adapter.`);
          console.warn(
            `[@astrojs/netlify] Otherwise, this adapter is not required to deploy a static site to Netlify.`
          );
        }
      },
      "astro:build:start": async ({ buildConfig }) => {
        _buildConfig = buildConfig;
        entryFile = buildConfig.serverEntry.replace(/\.m?js/, "");
        buildConfig.client = _config.outDir;
        buildConfig.server = new URL("./.netlify/edge-functions/", _config.root);
        buildConfig.serverEntry = "entry.js";
      },
      "astro:build:setup": ({ vite, target }) => {
        if (target === "server") {
          _vite = vite;
          vite.resolve = vite.resolve || {};
          vite.resolve.alias = vite.resolve.alias || {};
          const aliases = [{ find: "react-dom/server", replacement: "react-dom/server.browser" }];
          if (Array.isArray(vite.resolve.alias)) {
            vite.resolve.alias = [...vite.resolve.alias, ...aliases];
          } else {
            for (const alias of aliases) {
              vite.resolve.alias[alias.find] = alias.replacement;
            }
          }
          vite.ssr = {
            noExternal: true
          };
        }
      },
      "astro:build:done": async ({ routes, dir }) => {
        await bundleServerEntry(_buildConfig, _vite);
        await createEdgeManifest(routes, entryFile, _config.root);
        await createRedirects(routes, dir, entryFile, true);
      }
    }
  };
}
export {
  netlifyEdgeFunctions as default,
  getAdapter,
  netlifyEdgeFunctions
};
