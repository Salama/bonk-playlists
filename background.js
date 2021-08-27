chrome.webRequest.onBeforeRequest.addListener(
	(req) => {
	if (req.url.includes("/js/alpha2s.js") && !req.url.includes("?"))
		return {
		redirectUrl: chrome.runtime.getURL("runInjectors.js")
		};
	},
	{ urls: ["*://bonk.io/*"] },
	["blocking"]
);

chrome.runtime.onMessage.addListener(msg => {
	console.log(msg);
	if(msg[0] === "get") {
		return new Promise(resolve => {
			chrome.storage.local.get("playlists", (playlists => {
				if(playlists.playlists === undefined) {
					chrome.storage.local.set({playlists: "[]"});
					resolve("[]");
				}
				resolve(playlists.playlists);
			}));
		});
	}
	else if(msg[0] === "set") {
		chrome.storage.local.set({playlists: msg[1]});
	}
	else {
		return false;
	}
});