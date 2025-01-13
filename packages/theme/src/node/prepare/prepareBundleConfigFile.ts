import { getModulePath } from "@vuepress/helper";
import type { App } from "vuepress/core";

import { PageInfo } from "../../shared/index.js";
import type { ThemeStatus } from "../config/index.js";
import { BUNDLE_FOLDER } from "../utils.js";

/**
 * @private
 */
export const prepareBundleConfigFile = (
  app: App,
  { enableCatalog, enableBlog, enableEncrypt }: ThemeStatus,
): Promise<string> => {
  const imports: string[] = [];
  const enhances: string[] = [];
  const setups: string[] = [];
  const actions: string[] = [];
  const layouts = [];

  if (enableCatalog) {
    imports.push(
      `import { defineCatalogInfoGetter } from "${getModulePath(
        "@vuepress/plugin-catalog/client",
        import.meta,
      )}"`,
      `import { h } from "vue"`,
      `import { resolveComponent } from "vue"`,
    );
    actions.push(`\
defineCatalogInfoGetter((meta) => {
  const title = meta.${PageInfo.title};
  const shouldIndex = meta.${PageInfo.index} !== false;
  const icon = meta.${PageInfo.icon};

  return shouldIndex ? {
    title,
    content: icon ? () =>[h(resolveComponent("VPIcon"), { icon }), title] : null,
    order: meta.${PageInfo.order},
    index: meta.${PageInfo.index},
  } : null;
});`);
  }

  if (enableBlog) {
    imports.push(
      `import { BlogCategory, BlogHome, BlogType, BloggerInfo, SocialMedias, Timeline, setupBlog } from "${BUNDLE_FOLDER}modules/blog/export.js";`,
      `import "${BUNDLE_FOLDER}modules/blog/styles/all.scss";`,
    );

    enhances.push(
      `app.component("BloggerInfo", BloggerInfo);`,
      `app.component("SocialMedias", SocialMedias);`,
    );

    setups.push("setupBlog();");

    layouts.push("BlogCategory", "BlogHome", "BlogType", "Timeline");
  }

  if (enableEncrypt) {
    imports.push(
      `import { GlobalEncrypt, LocalEncrypt } from "${BUNDLE_FOLDER}modules/encrypt/export.js";`,
      `import "${BUNDLE_FOLDER}modules/encrypt/styles/all.scss"`,
    );

    enhances.push(
      `app.component("GlobalEncrypt", GlobalEncrypt);`,
      `app.component("LocalEncrypt", LocalEncrypt);`,
    );
  }

  return app.writeTemp(
    `theme-hope/config.js`,
    `\
import { Layout, NotFound, injectDarkmode, setupDarkmode, setupSidebarItems, scrollPromise } from "${BUNDLE_FOLDER}export.js";

${imports.join("\n")}

import "${getModulePath("@vuepress/helper/colors.css", import.meta)}";
import "${getModulePath("@vuepress/helper/normalize.css", import.meta)}";
import "${getModulePath("@vuepress/helper/sr-only.css", import.meta)}";
import "${BUNDLE_FOLDER}styles/all.scss";

${actions.join("\n")}

export default {
  enhance: ({ app, router }) => {
    const { scrollBehavior } = router.options;

    router.options.scrollBehavior = async (...args) => {
      await scrollPromise.wait();

      return scrollBehavior(...args);
    };

    // inject global properties
    injectDarkmode(app);

${enhances.map((item) => `    ${item}`).join("\n")}
  },
  setup: () => {
    setupDarkmode();
    setupSidebarItems();
${setups.map((item) => `    ${item}`).join("\n")}
  },
  layouts: {
    Layout,
    NotFound,
${layouts.map((item) => `    ${item},`).join("\n")}
  }
};
`,
  );
};
