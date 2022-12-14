import load from "@proload/core";
import autoprefixerPlugin from "autoprefixer";
import path from "path";
import tailwindPlugin from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig.js";
import { fileURLToPath } from "url";
function getDefaultTailwindConfig(srcUrl) {
  return resolveConfig({
    theme: {
      extend: {}
    },
    plugins: [],
    content: [path.join(fileURLToPath(srcUrl), `**`, `*.{astro,html,js,jsx,svelte,ts,tsx,vue}`)],
    presets: void 0
  });
}
async function getUserConfig(root, configPath) {
  const resolvedRoot = fileURLToPath(root);
  let userConfigPath;
  if (configPath) {
    const configPathWithLeadingSlash = /^\.*\//.test(configPath) ? configPath : `./${configPath}`;
    userConfigPath = fileURLToPath(new URL(configPathWithLeadingSlash, root));
  }
  return await load("tailwind", { mustExist: false, cwd: resolvedRoot, filePath: userConfigPath });
}
function tailwindIntegration(options) {
  var _a, _b;
  const applyBaseStyles = ((_a = options == null ? void 0 : options.config) == null ? void 0 : _a.applyBaseStyles) ?? true;
  const customConfigPath = (_b = options == null ? void 0 : options.config) == null ? void 0 : _b.path;
  return {
    name: "@astrojs/tailwind",
    hooks: {
      "astro:config:setup": async ({ config, injectScript }) => {
        const userConfig = await getUserConfig(config.root, customConfigPath);
        if (customConfigPath && !(userConfig == null ? void 0 : userConfig.value)) {
          throw new Error(
            `Could not find a Tailwind config at ${JSON.stringify(
              customConfigPath
            )}. Does the file exist?`
          );
        }
        const tailwindConfig = (userConfig == null ? void 0 : userConfig.value) ?? getDefaultTailwindConfig(config.srcDir);
        config.style.postcss.plugins.push(tailwindPlugin(tailwindConfig));
        config.style.postcss.plugins.push(autoprefixerPlugin);
        if (applyBaseStyles) {
          injectScript("page-ssr", `import '@astrojs/tailwind/base.css';`);
        }
      }
    }
  };
}
export {
  tailwindIntegration as default
};
