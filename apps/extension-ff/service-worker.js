browser.browserAction.onClicked.addListener(onClickExtensionSavePage);

function onClickExtensionSavePage(tab) {
  browser.tabs.executeScript(tab.id, {
    code: 'console.log("NOT IMPLEMENTED YET");',
  });
}

browser.contextMenus.onClicked.addListener(genericOnClick);

const SPECIAL_CASES = ["cosmos.so", "pinimg.com"];

async function genericOnClick(info) {
  const [space, branch] = info.menuItemId.split(":");

  const body = {
    spaceId: space,
    branchId: branch,
    mediaUrl: info.srcUrl || "",
    fromUrl: info.linkUrl || info.pageUrl,
  };

  SPECIAL_CASES.forEach(async (website) => {
    if (info.srcUrl.includes(website)) {
      switch (website) {
        case "pinimg.com":
          const split = info.srcUrl.slice(8).split("/");
          split[1] = "originals";
          const file = split[split.length - 1].split(".");
          split[split.length - 1] = `${file[0]}.jpg`;
          body.mediaUrl = `https://${split.join("/")}`;
          const error = await upload(body);
          if (error) {
            split[split.length - 1] = `${file[0]}.png`;
            body.mediaUrl = `https://${split.join("/")}`;
            upload(body);
          }
          break;
        default:
          console.log("Not handled yet");
      }
    }
  });
}

async function upload(body) {
  if (body.mediaUrl === "") return;

  const response = await fetch(
    "https://api.nosync.app/v1/branch/extension/add",
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok && response.status === 500) {
    return true;
  }

  return false;
}

browser.runtime.onInstalled.addListener(async () => {
  const res = await fetch("https://api.nosync.app/v1/auth/valid");
  const data = await res.json();
  const firstSpace = data.spaces[0];
  const firstBranch = firstSpace.branches[0];

  browser.contextMenus.create({
    title: "Save to Nosync",
    contexts: ["image"],
    id: `${firstSpace.id}:${firstBranch.id}`,
  });

  // TODO: Make this dynamic in the future, for now we'll
  // use only one button that send to the first ever created branch
  //
  // for (const space of data.spaces) {
  //   browser.contextMenus.create({
  //     title: space.name,
  //     contexts: ["link", "image", "selection"],
  //     id: "space-" + space.id,
  //   });
  //
  //   for (const branch of space.branches) {
  //     browser.contextMenus.create({
  //       title: branch.name,
  //       contexts: ["link", "image", "selection"],
  //       id: "branch-" + branch.id,
  //       parentId: "space-" + branch.spaceId,
  //     });
  //   }
  // }
});
