import CodeGroup from "@CodeGroup";
import CodeGroupItem from "@CodeGroupItem";
import FlowChart from "@FlowChart";
import Mermaid from "@Mermaid";
import Presentation from "@Presentation";
import type { EnhanceApp } from "@mr-hope/vuepress-types";

import "./styles/container.styl";

const enhanceApp: EnhanceApp = ({ Vue }) => {
  if (MARKDOWN_ENHANCE_ALIGN) void import("./styles/align.styl");

  if (CodeGroup.name) Vue.component("CodeGroup", CodeGroup);
  if (CodeGroupItem.name) Vue.component("CodeGroupItem", CodeGroupItem);

  if (MARKDOWN_ENHANCE_FOOTNOTE) void import("./styles/footnote.styl");

  if (FlowChart.name) Vue.component("FlowChart", FlowChart);

  if (Mermaid.name) Vue.component("Mermaid", Mermaid);

  if (Presentation.name) {
    Vue.component("Presentation", Presentation);

    if (REVEAL_CONFIG.plugins?.includes("chalkboard"))
      void import("@mr-hope/vuepress-shared-utils/styles/font-awesome.styl");
  }

  if (MARKDOWN_ENHANCE_TASKLIST) void import("./styles/tasklist.styl");

  if (MARKDOWN_ENHANCE_TEX) {
    void import("./styles/tex.styl");
    void import("katex/dist/katex.min.css");
  }
};

export default enhanceApp;
