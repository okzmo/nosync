browser.browserAction.onClicked.addListener(onClickExtensionSavePage);

function onClickExtensionSavePage(tab) {
  browser.tabs.executeScript(tab.id, {
    code: 'console.log("NOT IMPLEMENTED YET");',
  });
}

browser.contextMenus.onClicked.addListener(genericOnClick);

const SPECIAL_CASES = ["cosmos.so"];

async function genericOnClick(info) {
  const [space, branch] = info.menuItemId.split(":");

  const body = {
    spaceId: space,
    branchId: branch,
    mediaUrl: info.srcUrl || "",
    fromUrl: info.linkUrl || info.pageUrl,
  };

  // SPECIAL_CASES.forEach((website) => {
  //   if (info.pageUrl.includes(website) || info.linkUrl.includes(website)) {
  //     const url = specialCase(website);
  //     body.mediaUrl = url;
  //   }
  // });

  await fetch("https://api.nosync.app/v1/branch/extension/add", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// function specialCase(website) {
//   switch (website) {
//     case "cosmos.so":
//       break;
//   }
// }

browser.runtime.onInstalled.addListener(async () => {
  const res = await fetch("https://api.nosync.app/v1/auth/valid");
  const data = await res.json();
  const firstSpace = data.spaces[0];
  const firstBranch = firstSpace.branches[0];

  browser.contextMenus.create({
    title: "Save to Nosync",
    contexts: ["link", "image", "selection"],
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
