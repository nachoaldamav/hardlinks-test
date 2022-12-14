import { viteID } from "../util.js";
import { getPageDataByViteID } from "./internal.js";
function virtualHoistedEntry(id) {
  return id.startsWith("/astro/hoisted.js?q=");
}
function vitePluginHoistedScripts(astroConfig, internals) {
  return {
    name: "@astro/rollup-plugin-astro-hoisted-scripts",
    resolveId(id) {
      if (virtualHoistedEntry(id)) {
        return id;
      }
    },
    load(id) {
      if (virtualHoistedEntry(id)) {
        let code = "";
        for (let path of internals.hoistedScriptIdToHoistedMap.get(id)) {
          let importPath = path;
          if (importPath.startsWith("/@fs")) {
            importPath = importPath.slice("/@fs".length);
          }
          code += `import "${importPath}";`;
        }
        return {
          code
        };
      }
      return void 0;
    },
    async generateBundle(_options, bundle) {
      var _a, _b;
      let assetInlineLimit = ((_b = (_a = astroConfig.vite) == null ? void 0 : _a.build) == null ? void 0 : _b.assetsInlineLimit) || 4096;
      for (const [id, output] of Object.entries(bundle)) {
        if (output.type === "chunk" && output.facadeModuleId && virtualHoistedEntry(output.facadeModuleId)) {
          const canBeInlined = output.imports.length === 0 && output.dynamicImports.length === 0 && Buffer.byteLength(output.code) <= assetInlineLimit;
          let removeFromBundle = false;
          const facadeId = output.facadeModuleId;
          const pages = internals.hoistedScriptIdToPagesMap.get(facadeId);
          for (const pathname of pages) {
            const vid = viteID(new URL("." + pathname, astroConfig.root));
            const pageInfo = getPageDataByViteID(internals, vid);
            if (pageInfo) {
              if (canBeInlined) {
                pageInfo.hoistedScript = {
                  type: "inline",
                  value: output.code
                };
                removeFromBundle = true;
              } else {
                pageInfo.hoistedScript = {
                  type: "external",
                  value: id
                };
              }
            }
          }
          if (removeFromBundle) {
            delete bundle[id];
          }
        }
      }
    }
  };
}
export {
  vitePluginHoistedScripts
};
