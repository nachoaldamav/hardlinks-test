import fs from "fs";
async function createRedirects(routes, dir, entryFile, edge) {
  const _redirectsURL = new URL("./_redirects", dir);
  const kind = edge ? "edge-functions" : "functions";
  let _redirects = "";
  for (const route of routes) {
    if (route.pathname) {
      _redirects += `
  ${route.pathname}    /.netlify/${kind}/${entryFile}    200`;
      if (route.route === "/404") {
        _redirects += `
  /*    /.netlify/${kind}/${entryFile}    404`;
      }
    } else {
      const pattern = "/" + route.segments.map(([part]) => part.dynamic ? "*" : part.content).join("/");
      _redirects += `
  ${pattern}    /.netlify/${kind}/${entryFile}    200`;
    }
  }
  await fs.promises.appendFile(_redirectsURL, _redirects, "utf-8");
}
export {
  createRedirects
};
