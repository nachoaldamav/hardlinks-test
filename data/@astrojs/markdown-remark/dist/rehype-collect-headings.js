import Slugger from "github-slugger";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
function createCollectHeadings() {
  const headings = [];
  const slugger = new Slugger();
  function rehypeCollectHeadings() {
    return function(tree) {
      visit(tree, (node) => {
        if (node.type !== "element")
          return;
        const { tagName } = node;
        if (tagName[0] !== "h")
          return;
        const [_, level] = tagName.match(/h([0-6])/) ?? [];
        if (!level)
          return;
        const depth = Number.parseInt(level);
        let text = "";
        let isJSX = false;
        visit(node, (child, __, parent) => {
          if (child.type === "element" || parent == null) {
            return;
          }
          if (child.type === "raw") {
            if (child.value.match(/^\n?<.*>\n?$/)) {
              return;
            }
          }
          if (child.type === "text" || child.type === "raw") {
            if ((/* @__PURE__ */ new Set(["code", "pre"])).has(parent.tagName)) {
              text += child.value;
            } else {
              text += child.value.replace(/\{/g, "${");
              isJSX = isJSX || child.value.includes("{");
            }
          }
        });
        node.properties = node.properties || {};
        if (typeof node.properties.id !== "string") {
          if (isJSX) {
            const raw = toHtml(node.children, { allowDangerousHtml: true }).replace(/\n(<)/g, "<").replace(/(>)\n/g, ">");
            node.properties.id = `$$slug(\`${text}\`)`;
            node.type = "raw";
            node.value = `<${node.tagName} id={${node.properties.id}}>${raw}</${node.tagName}>`;
          } else {
            let slug = slugger.slug(text);
            if (slug.endsWith("-"))
              slug = slug.slice(0, -1);
            node.properties.id = slug;
          }
        }
        headings.push({ depth, slug: node.properties.id, text });
      });
    };
  }
  return {
    headings,
    rehypeCollectHeadings
  };
}
export {
  createCollectHeadings as default
};
