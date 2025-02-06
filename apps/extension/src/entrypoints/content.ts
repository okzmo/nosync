import App from "./App.svelte";
import "./styles.css";
import { mount, unmount } from "svelte";

export default defineContentScript({
  matches: ["*://*.pinterest.com/*"],
  matchAboutBlank: true,
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "example-ui",
      position: "overlay",
      anchor: "body",
      onMount: (container) => {
        mount(App, {
          target: container,
        });
      },
      onRemove: () => {
        unmount(App);
      },
    });

    ui.mount();

    const anchors = document.body.getElementsByTagName("a");

    ctx.addEventListener(window, "keydown", (evt) => {
      if (evt.key === "j") {
        for (let i = 0; i < anchors.length; i++) {
          anchors[i].style.pointerEvents = "none";
        }
      } else if (evt.key === "Escape") {
        for (let i = 0; i < anchors.length; i++) {
          anchors[i].style.pointerEvents = "auto";
        }
      }
    });

    ctx.addEventListener(document.body, "click", (evt) => {
      console.log(evt.target);
    });
  },
});
