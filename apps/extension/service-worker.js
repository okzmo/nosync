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
  const body = {
    spaceId: info.parentMenuItemId.split("-")[1],
    branchId: info.menuItemId.split("-")[1],
    mediaUrl: info.srcUrl || "",
    fromUrl: info.linkUrl || info.pageUrl,
  };

  // SPECIAL_CASES.forEach((website) => {
  //   if (info.pageUrl.includes(website) || info.linkUrl.includes(website)) {
  //     const url = specialCase(website);
  //     body.mediaUrl = url;
  //   }
  // });

  console.log(body);

  await fetch("http://localhost:3333/v1/branch/extension/add", {
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
  const res = await fetch("http://localhost:3333/v1/auth/valid");
  const data = await res.json();
  let spaces = [];
  let branches = [];

  for (const space of data.spaces) {
    spaces.push(space);
    branches.push(...space.branches);
  }

  for (let i = 0; i < spaces.length; i++) {
    let space = spaces[i];
    chrome.contextMenus.create({
      title: space.name,
      contexts: ["link", "image", "selection"],
      id: "space-" + space.id,
    });
  }

  for (let i = 0; i < branches.length; i++) {
    let branch = branches[i];
    chrome.contextMenus.create({
      title: branch.name,
      contexts: ["link", "image", "selection"],
      id: "branch-" + branch.id,
      parentId: "space-" + branch.spaceId,
    });
  }
});
