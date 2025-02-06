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

async function genericOnClick(info) {
  const body = {
    spaceId: info.parentMenuItemId.split("-")[1],
    branchId: info.menuItemId.split("-")[1],
    mediaUrl: info.srcUrl,
    fromUrl: info.linkUrl,
  };

  const res = await fetch("http://localhost:3333/v1/branch/extension/add", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  console.log(res);
}

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
      contexts: ["link"],
      id: "space-" + space.id,
    });
  }

  for (let i = 0; i < branches.length; i++) {
    let branch = branches[i];
    chrome.contextMenus.create({
      title: branch.name,
      contexts: ["link"],
      id: "branch-" + branch.id,
      parentId: "space-" + branch.spaceId,
    });
  }
});
