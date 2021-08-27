document.addEventListener("storePlaylists", async (e) => {
	if(e.detail[0] === "get") {
		let returnEvent = new CustomEvent("returnPlaylists", {"detail": await chrome.runtime.sendMessage(["get"])});
		document.dispatchEvent(returnEvent);
	}
	else if(e.detail[0] === "set") {
		chrome.runtime.sendMessage(["set", e.detail[1]]);
	}
})

const script = document.createElement("script");
script.src = chrome.runtime.getURL("injector.js");
document.head.appendChild(script);