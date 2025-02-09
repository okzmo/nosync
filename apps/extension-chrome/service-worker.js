chrome.action.onClicked.addListener(onClickExtensionSavePage);

function onClickExtensionSavePage(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log("NOT IMPLEMENTED YET");
    },
  });
}

chrome.contextMenus.onClicked.addListener(genericOnClick);

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

chrome.runtime.onInstalled.addListener(async function () {
  const res = await fetch("https://api.nosync.app/v1/auth/valid");
  const data = await res.json();
  const firstSpace = data.spaces[0];
  const firstBranch = firstSpace.branches[0];

  chrome.contextMenus.create({
    title: "Save to Nosync",
    contexts: ["link", "image", "selection"],
    id: `${firstSpace.id}:${firstBranch.id}`,
  });

  // for (const space of data.spaces) {
  //   chrome.contextMenus.create({
  //     title: space.name,
  //     contexts: ["link", "image", "selection"],
  //     id: "space-" + space.id,
  //   });
  //
  //   for (const branch of space.branches) {
  //     chrome.contextMenus.create({
  //       title: branch.name,
  //       contexts: ["link", "image", "selection"],
  //       id: "branch-" + branch.id,
  //       parentId: "space-" + branch.spaceId,
  //     });
  //   }
  // }
});
