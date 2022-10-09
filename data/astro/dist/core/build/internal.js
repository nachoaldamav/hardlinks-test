import { prependForwardSlash, removeFileExtension } from "../path.js";
import { viteID } from "../util.js";
function createBuildInternals() {
  const hoistedScriptIdToHoistedMap = /* @__PURE__ */ new Map();
  const hoistedScriptIdToPagesMap = /* @__PURE__ */ new Map();
  return {
    cssChunkModuleIds: /* @__PURE__ */ new Set(),
    hoistedScriptIdToHoistedMap,
    hoistedScriptIdToPagesMap,
    entrySpecifierToBundleMap: /* @__PURE__ */ new Map(),
    pagesByComponent: /* @__PURE__ */ new Map(),
    pagesByViteID: /* @__PURE__ */ new Map(),
    pagesByClientOnly: /* @__PURE__ */ new Map(),
    discoveredHydratedComponents: /* @__PURE__ */ new Set(),
    discoveredClientOnlyComponents: /* @__PURE__ */ new Set(),
    discoveredScripts: /* @__PURE__ */ new Set(),
    staticFiles: /* @__PURE__ */ new Set()
  };
}
function trackPageData(internals, component, pageData, componentModuleId, componentURL) {
  pageData.moduleSpecifier = componentModuleId;
  internals.pagesByComponent.set(component, pageData);
  internals.pagesByViteID.set(viteID(componentURL), pageData);
}
function trackClientOnlyPageDatas(internals, pageData, clientOnlys) {
  for (const clientOnlyComponent of clientOnlys) {
    let pageDataSet;
    if (internals.pagesByClientOnly.has(clientOnlyComponent)) {
      pageDataSet = internals.pagesByClientOnly.get(clientOnlyComponent);
    } else {
      pageDataSet = /* @__PURE__ */ new Set();
      internals.pagesByClientOnly.set(clientOnlyComponent, pageDataSet);
    }
    pageDataSet.add(pageData);
  }
}
function* getPageDatasByChunk(internals, chunk) {
  const pagesByViteID = internals.pagesByViteID;
  for (const [modulePath] of Object.entries(chunk.modules)) {
    if (pagesByViteID.has(modulePath)) {
      yield pagesByViteID.get(modulePath);
    }
  }
}
function* getPageDatasByClientOnlyID(internals, viteid) {
  const pagesByClientOnly = internals.pagesByClientOnly;
  if (pagesByClientOnly.size) {
    let pathname = `/@fs${prependForwardSlash(viteid)}`;
    let pageBuildDatas = pagesByClientOnly.get(viteid);
    if (!pageBuildDatas) {
      pathname = `/@fs${prependForwardSlash(removeFileExtension(viteid))}`;
      pageBuildDatas = pagesByClientOnly.get(pathname);
    }
    if (pageBuildDatas) {
      for (const pageData of pageBuildDatas) {
        yield pageData;
      }
    }
  }
}
function getPageDataByComponent(internals, component) {
  if (internals.pagesByComponent.has(component)) {
    return internals.pagesByComponent.get(component);
  }
  return void 0;
}
function getPageDataByViteID(internals, viteid) {
  if (internals.pagesByViteID.has(viteid)) {
    return internals.pagesByViteID.get(viteid);
  }
  return void 0;
}
function hasPageDataByViteID(internals, viteid) {
  return internals.pagesByViteID.has(viteid);
}
function* eachPageData(internals) {
  yield* internals.pagesByComponent.values();
}
function sortedCSS(pageData) {
  return Array.from(pageData.css).sort((a, b) => {
    let depthA = a[1].depth, depthB = b[1].depth;
    if (depthA === -1) {
      return -1;
    } else if (depthB === -1) {
      return 1;
    } else {
      return depthA > depthB ? -1 : 1;
    }
  }).map(([id]) => id);
}
function isHoistedScript(internals, id) {
  return internals.hoistedScriptIdToPagesMap.has(id);
}
function* getPageDatasByHoistedScriptId(internals, id) {
  const set = internals.hoistedScriptIdToPagesMap.get(id);
  if (set) {
    for (const pageId of set) {
      const pageData = getPageDataByComponent(internals, pageId.slice(1));
      if (pageData) {
        yield pageData;
      }
    }
  }
}
export {
  createBuildInternals,
  eachPageData,
  getPageDataByComponent,
  getPageDataByViteID,
  getPageDatasByChunk,
  getPageDatasByClientOnlyID,
  getPageDatasByHoistedScriptId,
  hasPageDataByViteID,
  isHoistedScript,
  sortedCSS,
  trackClientOnlyPageDatas,
  trackPageData
};
