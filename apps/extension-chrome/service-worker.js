const SPECIAL_CASES = ["pinimg.com"];

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

chrome.runtime.onInstalled.addListener(async function () {
  const res = await fetch("https://api.nosync.app/v1/auth/valid");
  const data = await res.json();
  const firstSpace = data.spaces[0];
  const firstBranch = firstSpace.branches[0];

  chrome.contextMenus.create({
    title: "Save to Nosync",
    contexts: ["image", "page", "frame", "link"],
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

async function genericOnClick(info) {
  const [space, branch] = info.menuItemId.split(":");

  if (info.srcUrl) {
    const body = {
      spaceId: space,
      branchId: branch,
      mediaUrl: info.srcUrl || "",
      fromUrl: info.linkUrl || info.pageUrl,
    };

    await handleSpecialCases(body, info);
    return
  }

  let mediaUrl;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    mediaUrl = await chrome.tabs.sendMessage(tab.id, 'GET_IMAGE');
  } catch (e) {
    console.log('No image found');
    return;
  }

  if (mediaUrl) {
    const body = {
      spaceId: space,
      branchId: branch,
      mediaUrl: mediaUrl,
      fromUrl: info.pageUrl,
    };

    await handleSpecialCases(body, { srcUrl: mediaUrl })
  }
}

async function handleSpecialCases(body, info) {
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
