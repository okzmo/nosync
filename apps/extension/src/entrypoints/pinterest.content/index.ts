import { mount, unmount } from "svelte";
import "./styles.css";
import App from "./App.svelte";

export default defineContentScript({
  matches: ["*://*.pinterest.com/*"],
  matchAboutBlank: true,
  cssInjectionMode: "manifest",
  async main(ctx) {
    const eventTypes = ["click", "touchstart"];

    function handler(evt) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      evt.stopPropagation();

      const parent = evt.target.parentElement.parentElement;
      if (!parent) return;

      console.log(parent.dataset.testId);
      if (parent.dataset?.testId?.includes("deeplink-wrapper")) {
        console.log("here");
        const pinterestImage = parent.querySelector('[data-test-id="pin"] img');
        if (pinterestImage) {
          console.log(pinterestImage.src);
        }
      }

      return false;
    }

    function handleMouseOver(evt) {
      const parent = evt.target?.parentElement?.parentElement;
      if (!parent) return;

      if (
        parent.dataset?.testId?.includes("pincard-image") ||
        parent.dataset?.testId?.includes("pin-with-alt") ||
        parent.dataset?.testId?.includes("pincard-storyPin")
      ) {
        parent.classList.add("__nosync_pinterest_image");
        parent.addEventListener("mouseleave", () => handleMouseLeave(parent));

        const pinterestImage = parent.querySelector('[data-test-id="pin"] img');
        if (pinterestImage) {
        }
      }
    }

    function handleMouseLeave(parent) {
      parent.classList.remove("__nosync_pinterest_image");
      parent.removeEventListener("mouseleave", () => handleMouseLeave(parent));
    }

    ctx.addEventListener(window, "keydown", (evt) => {
      if (evt.key === "j") {
        for (const event of eventTypes) {
          document.addEventListener(event, handler, {
            passive: false,
            capture: true,
          });
        }
        document.addEventListener("mouseover", handleMouseOver);
      } else if (evt.key === "Escape") {
        for (const event of eventTypes) {
          document.removeEventListener(event, handler, {
            capture: true,
          });
        }
        document.removeEventListener("mouseover", handleMouseOver);
      }
    });
  },
});
