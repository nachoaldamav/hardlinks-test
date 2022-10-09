import { App } from "astro/app";
const clientAddressSymbol = Symbol.for("astro.clientAddress");
function createExports(manifest) {
  const app = new App(manifest);
  const handler = async (request) => {
    const url = new URL(request.url);
    if (manifest.assets.has(url.pathname)) {
      return;
    }
    if (app.match(request)) {
      const ip = request.headers.get("x-nf-client-connection-ip");
      Reflect.set(request, clientAddressSymbol, ip);
      return app.render(request);
    }
    return new Response(null, {
      status: 404,
      statusText: "Not found"
    });
  };
  return { default: handler };
}
export {
  createExports
};
