"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// stackbit.config.ts
var stackbit_config_exports = {};
__export(stackbit_config_exports, {
  default: () => stackbit_config_default
});
module.exports = __toCommonJS(stackbit_config_exports);
var import_types = require("@stackbit/types");
var import_cms_git = require("@stackbit/cms-git");
var stackbit_config_default = (0, import_types.defineStackbitConfig)({
  stackbitVersion: "~0.8.0",
  ssgName: "nextjs",
  nodeVersion: "18",
  // Point to your Next.js development server
  devCommand: "npm run dev",
  contentSources: [
    new import_cms_git.GitContentSource({
      rootPath: "/Users/briannaanderson/ga4-assistant",
      contentDirs: ["content"],
      models: [
        {
          name: "page",
          type: "page",
          label: "Page",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
              required: true
            },
            {
              type: "string",
              name: "description",
              label: "Description"
            },
            {
              type: "markdown",
              name: "content",
              label: "Content"
            }
          ]
        },
        {
          name: "blogPost",
          type: "page",
          label: "Blog Post",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
              required: true
            },
            {
              type: "string",
              name: "description",
              label: "Description"
            },
            {
              type: "markdown",
              name: "content",
              label: "Content",
              required: true
            },
            {
              type: "list",
              name: "tags",
              label: "Tags",
              items: {
                type: "string"
              }
            },
            {
              type: "datetime",
              name: "date",
              label: "Date",
              required: true
            },
            {
              type: "string",
              name: "author",
              label: "Author",
              required: true
            },
            {
              type: "string",
              name: "slug",
              label: "Slug",
              required: true
            }
          ]
        }
      ]
    })
  ]
});
//# sourceMappingURL=stackbit.config.DPOSGOHF.cjs.map
