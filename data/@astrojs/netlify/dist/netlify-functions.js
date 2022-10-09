import { polyfill } from "@astrojs/webapi";
import { App } from "astro/app";
polyfill(globalThis, {
  exclude: "window document"
});
function parseContentType(header) {
  return (header == null ? void 0 : header.split(";")[0]) ?? "";
}
const clientAddressSymbol = Symbol.for("astro.clientAddress");
const createExports = (manifest, args) => {
  const app = new App(manifest);
  const binaryMediaTypes = args.binaryMediaTypes ?? [];
  const knownBinaryMediaTypes = /* @__PURE__ */ new Set([
    "audio/3gpp",
    "audio/3gpp2",
    "audio/aac",
    "audio/midi",
    "audio/mpeg",
    "audio/ogg",
    "audio/opus",
    "audio/wav",
    "audio/webm",
    "audio/x-midi",
    "image/avif",
    "image/bmp",
    "image/gif",
    "image/vnd.microsoft.icon",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "video/3gpp",
    "video/3gpp2",
    "video/mp2t",
    "video/mp4",
    "video/mpeg",
    "video/ogg",
    "video/x-msvideo",
    "video/webm",
    ...binaryMediaTypes
  ]);
  const handler = async (event) => {
    const { httpMethod, headers, rawUrl, body: requestBody, isBase64Encoded } = event;
    const init = {
      method: httpMethod,
      headers: new Headers(headers)
    };
    if (httpMethod !== "GET" && httpMethod !== "HEAD") {
      const encoding = isBase64Encoded ? "base64" : "utf-8";
      init.body = typeof requestBody === "string" ? Buffer.from(requestBody, encoding) : requestBody;
    }
    const request = new Request(rawUrl, init);
    let routeData = app.match(request, { matchNotFound: true });
    if (!routeData) {
      return {
        statusCode: 404,
        body: "Not found"
      };
    }
    const ip = headers["x-nf-client-connection-ip"];
    Reflect.set(request, clientAddressSymbol, ip);
    const response = await app.render(request, routeData);
    const responseHeaders = Object.fromEntries(response.headers.entries());
    const responseContentType = parseContentType(responseHeaders["content-type"]);
    const responseIsBase64Encoded = knownBinaryMediaTypes.has(responseContentType);
    const responseBody = responseIsBase64Encoded ? Buffer.from(await response.text(), "binary").toString("base64") : await response.text();
    const fnResponse = {
      statusCode: response.status,
      headers: responseHeaders,
      body: responseBody,
      isBase64Encoded: responseIsBase64Encoded
    };
    if (response.headers.has("set-cookie") && "raw" in response.headers) {
      const rawPacked = response.headers.raw();
      if ("set-cookie" in rawPacked) {
        fnResponse.multiValueHeaders = {
          "set-cookie": rawPacked["set-cookie"]
        };
      }
    }
    return fnResponse;
  };
  return { handler };
};
export {
  createExports
};
