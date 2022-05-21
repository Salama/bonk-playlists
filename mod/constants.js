window.playlists = {};
window.playlists.edit = false;
window.playlists.autofav = false;
window.playlists.editing = false;
let token = null;
window.playlists.merge = {
	enabled: false,
	from: {
		element: null,
		index: null
	},
	to: {
		element: null,
		index: null
	}
};
let dropdownOption = document.createElement('div');
let playlistsButton = document.createElement('div');
let toolbox = document.createElement('div');
//Insert before favs
document.getElementById("maploadtypedropdown").insertBefore(dropdownOption, document.getElementById("maploadtypedropdownoption1"));
document.getElementById("maploadwindow").appendChild(playlistsButton);
document.getElementById("maploadwindow").appendChild(toolbox);
toolbox.outerHTML = `<div id="maploadwindowtoolbox" style="width: 100%;height: 23px;bottom: 0;position: absolute;background-color: inherit;z-index: 1;display: none;padding: 5px;">
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistedit" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">EDIT</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistmerge" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">MERGE</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistimport" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">IMPORT</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistexport" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">EXPORT</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistautofav" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;">AUTOFAV</div>
	<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistdeleteall" style="line-height: 23px; height: 23px; width: 125px; margin-right: 5px; display: none;">DELETE ALL</div>
</div>`;

dropdownOption.outerHTML = `<div class="dropdown-option dropdown_classic" id="maploadtypedropdownoptionplaylists" style="display: none;">MY PLAYLISTS</div>`;
playlistsButton.outerHTML = `<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistbutton" onclick="document.getElementById(&quot;maploadtypedropdownoptionplaylists&quot;).click();" style="position: absolute; left: 210px; line-height: 23px; height: 23px; width: 75px; top: 57px; display: block;">BACK</div>`;

let dbRequest = indexedDB.open("salamaStorage", 1);
let db;

window.playlists.playlists = [];

window.playlists.savePlaylists = playlists => {
	let transaction = db.transaction("playlists", "readwrite");
	transaction.objectStore("playlists").put(playlists, 1);
}

dbRequest.onsuccess = e => {
	db = e.target.result;
	let transaction = db.transaction("playlists");
	let getRequest = transaction.objectStore("playlists").get(1);
	getRequest.onsuccess = e => {
		window.playlists.playlists = e.target.result;
	}
}

dbRequest.onupgradeneeded = e => {
	db = e.target.result;
	let objectStore = db.createObjectStore("playlists");
	objectStore.put(JSON.parse(localStorage.playlists || "[]"), 1);
	delete localStorage.playlists;
}

window.playlists.setToken = t => {
	token = t;
}

//This is mainly meant to prevent you from accidentally importing the wrong file
const validatePlaylists = playlists => {
	try {
		let newPlaylists = JSON.parse(playlists);
		for(let playlist of newPlaylists) {
			if(!(
				Object.keys(playlist) == "name,description,image,maps,b1maps" &&
				typeof(playlist.name) == "string" &&
				typeof(playlist.description) == "string" &&
				(typeof(playlist.image) == "string" || playlist.image == undefined) &&
				playlist.maps.filter(e => {return typeof(e)=="number"}).length == playlist.maps.length
			))
				return false;
		}
		return true;
	}
	catch {
		return false;
	}
}

document.getElementById("maploadwindowplaylistexport").addEventListener("click", () => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = URL.createObjectURL(new Blob([JSON.stringify(window.playlists.playlists)], {type: "oclet/stream"}));
    a.download = "playlists.txt";
    a.click();
    document.body.removeChild(a);
})

document.getElementById("maploadwindowplaylistimport").addEventListener("click", () => {
    let a = document.createElement("input");
    a.type = 'file';
    document.body.appendChild(a);
    a.onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = readerEvent => {
			let newPlaylists = readerEvent.target.result;
			if(validatePlaylists(newPlaylists)) {
				window.playlists.playlists = window.playlists.playlists.concat(JSON.parse(newPlaylists));
			window.playlists.savePlaylists(window.playlists.playlists);
				document.getElementById("maploadwindowplaylistautofav").click();
			}
        }
    };
    a.click();
    document.body.removeChild(a);
})

document.getElementById("maploadwindowplaylistautofav").addEventListener("click", async () => {
	let popup = document.createElement('div');
	document.getElementById("maploadwindow").appendChild(popup);
	popup.outerHTML = `
	<div id="maploadwindowplaylistautofavpopup" style="width: calc(100% - 200px);background-color: inherit;z-index: 1;position: absolute;left: 100px;top: 50px;height: calc(100% - 100px);filter: brightness(1.1);border-radius: 7px;">
		<div class="windowTopBar_classic" style="height: 40px;border-top-left-radius: 3px;border-top-right-radius: 3px;font-family: futurept_b1;line-height: 40px;color: #f9f9f9;font-size: 28px;text-align: center;">
			Autofav
			<div id="maploadwindowplaylistautofavprogress" style="height: 40px;font-family: monospace;line-height: 40px;color: #f9f9f9;font-size: 15px;text-align: center;right: 10px;position: absolute;top: 0px;"></div>
		</div>
		<div class="newbonklobby_chat_msg_txt" id="maploadwindowplaylistautofavstatus" style="text-align: center;top: 20px;position: relative;">Counting maps...</div>
		<div class="brownButton brownButton_classic buttonShadow" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;bottom: 10px;position: absolute;left: 20px;" id="maploadwindowplaylistautofavcancel">CANCEL</div>
		<div style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: block;bottom: 10px;position: absolute;right: 20px;" id="maploadwindowplaylistautofavstart" class="brownButton brownButton_classic buttonShadow brownButtonDisabled">START</div>
		<div class="brownButton brownButton_classic buttonShadow" style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: none;bottom: 10px;position: absolute;left: 20px;" id="maploadwindowplaylistautofavno">NO</div>
		<div style="line-height: 23px; height: 23px; width: 75px; margin-right: 5px; display: none;bottom: 10px;position: absolute;right: 20px;" class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistautofavyes">YES</div>
	</div>`;
	let error = false;
	document.getElementById("maploadwindowplaylistautofavcancel").addEventListener("click", () => {
		error = "cancelled";
		document.getElementById("maploadwindowplaylistautofavpopup").remove();
		document.getElementById("maploadtypedropdownoptionplaylists").click();
	});
	let maps = [];
	const get = async count => {
		return new Promise(resolve => {
			window.$.post("https://bonk2.io/scripts/map_getfave.php", {
				token: token,
				startingfrom: 32 * count
			}).done(async e => {
				maps = maps.concat(e.maps.map(e => {return e.id}));
				error = (e.r == "success" ? false : e.r);
				if(e.more && !error) await get(count + 1);
				resolve();
			}).fail(e => {
				error = e.statusText;
				resolve();
			});
		});
	}
	await get(0);
	if(error && error != "cancelled") {
		document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nError: ${error}`;
	}
	else if(error != "cancelled") {
		maps = [...new Set(window.playlists.playlists.map(e => {return e.maps;}).reduce((a, b) => {return a.concat(b);}).filter(e => {return !maps.includes(e);}))];
		document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\n${maps.length} maps to favorite`;
		document.getElementById("maploadwindowplaylistautofavprogress").innerText = `[${'0'.repeat((maps.length+'').length)} / ${maps.length}]`;
		if(maps.length == 0) return;
		let date = new Date();
		if(maps.length > 600) {
			document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nYou will get ratelimited due to the high amount of maps, which means that you will have to continue this after ${((date.getHours() + 1) % 24)}:00. This also means that you can't favorite maps normally before that time.`;
		}
		else if(maps.length > 580) {
			document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nYou might get ratelimited due to the high amount of maps, which means that you will have to continue this after ${((date.getHours() + 1) % 24)}:00. This would also mean that you can't favorite maps normally before that time.`;
		}
		document.getElementById("maploadwindowplaylistautofavstart").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofavstart").addEventListener("click", async () => {
			document.getElementById("maploadwindowplaylistautofavstart").classList.add("brownButtonDisabled");
			window.playlists.autofav = true;
			let count = 0;
			let notFound = [];
			for(let map of maps) {
				if(error) {
					window.playlists.autofav = false;
					return;
				}
				await window.$.post("https://bonk2.io/scripts/map_fave.php", {
					token: token,
					mapid: map,
					action: "f"
				}).done(e => {
					if(e.r === "fail") {
						switch(e.e) {
							case "map_unpublished":
							case "map_not_found":
							case "already_faved":
								notFound.push(map);
								break;
							case "token":
								document.getElementById("maploadwindowplaylistautofavstatus").innerText += "\nError: invalid token";
								break;
							case "ratelimited":
								document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nRatelimited! Please continue after ${((date.getHours() + 1) % 24)}:00.`;
								error = "ratelimited";
								break;
						}
					}
					count++;
					if(!error) document.getElementById("maploadwindowplaylistautofavprogress").innerText = `[${'0'.repeat((maps.length+'').length-(count+'').length)}${count} / ${maps.length}]`;
					
				})
			}
			window.playlists.autofav = false;
			document.getElementById("maploadwindowplaylistautofavcancel").classList.add("brownButtonDisabled");
			if(notFound.length > 0) {
				document.getElementById("maploadwindowplaylistautofavstatus").innerText += `\nSome of the playlists contain ${notFound.length} maps in total that have been hidden or deleted. Do you want to remove them?`;
				document.getElementById("maploadwindowplaylistautofavno").style.display = "block";
				document.getElementById("maploadwindowplaylistautofavyes").style.display = "block";
				document.getElementById("maploadwindowplaylistautofavstart").style.display = "none";
				document.getElementById("maploadwindowplaylistautofavcancel").style.display = "none";
				document.getElementById("maploadwindowplaylistautofavno").addEventListener("click", () => {
					document.getElementById("maploadwindowplaylistautofavpopup").remove();
					document.getElementById("maploadtypedropdownoptionplaylists").click();
				});
				document.getElementById("maploadwindowplaylistautofavyes").addEventListener("click", () => {
					for(let list of window.playlists.playlists) {
						list.maps = list.maps.filter(e => {return notFound.indexOf(e) === -1;});
					}
					window.playlists.savePlaylists(window.playlists.playlists);
					document.getElementById("maploadwindowplaylistautofavpopup").remove();
					document.getElementById("maploadtypedropdownoptionplaylists").click();
				});
			}
			else {
				document.getElementById("maploadwindowplaylistautofavyes").innerText = "DONE";
				document.getElementById("maploadwindowplaylistautofavyes").style.display = "block";
				document.getElementById("maploadwindowplaylistautofavyes").addEventListener("click", () => {
					document.getElementById("maploadwindowplaylistautofavpopup").remove();
					document.getElementById("maploadtypedropdownoptionplaylists").click();
				})
			}
		});
	}
});

document.getElementById("maploadwindowplaylistedit").addEventListener("click", e => {
	window.playlists.editing = false;
	window.playlists.edit = !window.playlists.edit;
	if(window.playlists.edit) {
		document.getElementById("maploadwindowplaylistmerge").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistdeleteall").style.display = "block";
		document.getElementById("maploadwindowplaylistdeleteall").innerText = "DELETE ALL";
		e.target.style.filter = "brightness(1.75)";
		document.getElementById("maploadwindowplaylistnew").style.display = "inline-block";
	}
	else {
		document.getElementById("maploadwindowplaylistedit").style.removeProperty("filter");
		document.getElementById("maploadwindowplaylistnew").style.display = "none";
		document.getElementById("maploadwindowplaylistmerge").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistdeleteall").style.display = "none";
		window.playlists.savePlaylists(window.playlists.playlists);
		document.getElementById("maploadtypedropdownoptionplaylists").click();
	}
});

document.getElementById("maploadwindowplaylistmerge").addEventListener("click", e => {
	window.playlists.merge.enabled = !window.playlists.merge.enabled;
	if(window.playlists.merge.enabled) {
		window.playlists.edit = false;
		document.getElementById("maploadwindowplaylistedit").style.removeProperty("filter");
		document.getElementById("maploadwindowplaylistnew").style.display = "none";
		e.target.style.filter = "brightness(1.75)";
		document.getElementById("maploadwindowplaylistedit").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.add("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.add("brownButtonDisabled");
	}
	else {
		e.target.style.removeProperty("filter");
		if(window.playlists.merge.from.element !== null) {
			window.playlists.merge.from.element.style.removeProperty("filter");
			window.playlists.merge.from.element.style.visibility = "hidden";
		}
		if(window.playlists.merge.to.element !== null) {
			window.playlists.merge.to.element.style.removeProperty("filter");
			window.playlists.merge.to.element.style.visibility = "hidden";
		}
		window.playlists.merge = {
			enabled: false,
			from: {
				element: null,
				index: null
			},
			to: {
				element: null,
				index: null
			}
		};
		document.getElementById("maploadwindowplaylistedit").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistimport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistexport").classList.remove("brownButtonDisabled");
		document.getElementById("maploadwindowplaylistautofav").classList.remove("brownButtonDisabled");
		document.getElementById("maploadtypedropdownoptionplaylists").click();
	}
});

document.getElementById("maploadwindowplaylistdeleteall").addEventListener("click", e => {
	switch(e.target.innerText) {
		case "DELETE ALL":
			e.target.innerText = "SURE?";
			break;
		case "SURE?":
			e.target.innerText = "100% SURE?";
			break;
		case "100% SURE?":
			e.target.innerText = "FINAL WARNING";
			break;
		case "FINAL WARNING":
			e.target.innerText = "DELETE ALL";
			window.playlists.playlists = [];
			for(let playlist of [...document.getElementsByClassName("maploadwindowplaylistdiv")]) {
				playlist.style.opacity = 0.3;
				playlist.style.pointerEvents = "none";
			}
			break;
	}
})

document.getElementById("newbonklobby_mapbutton").addEventListener("click", () => {
    if(document.getElementById("maploadtypedropdowntitle").innerText === "MY PLAYLISTS") {
        document.getElementById("maploadwindowplaylistbutton").style.display = "block";
		document.getElementById("maploadwindowtoolbox").style.display = "flex";
		document.getElementById("maploadwindowmapscontainer").style.bottom = "28px";
		document.getElementById("maploadwindowmapscontainer").style.height = "calc(100% - 108px - 23px)";
    }
    else {
        document.getElementById("maploadwindowplaylistbutton").style.display = "none";
		document.getElementById("maploadwindowtoolbox").style.display = "none";
		document.getElementById("maploadwindowmapscontainer").style.removeProperty("bottom");
		document.getElementById("maploadwindowmapscontainer").style.removeProperty("height");
    }
});

const PLAYLIST_SCROLL = `
if(o0k[65] == "playlists") {return;} else if(o0k[65] == G9b.A43(3378) || o0k[65] == G9b.z43(3395) || o0k[65] == G9b.z43(3379))`;

const PLAYLIST_COMMANDS = `
if (I8H[5][0] == "/p") {
	if(I8H[5][1] == "list") {
		F5S("Saved playlists", "#cc3333", true);
		for(let i = 0; i < window.playlists.playlists.length; i++) {
			F5S("* [" + (i+1) + "] " + window.playlists.playlists[i].name, "#cc3333", true);
		}
	}
	else if(!isNaN(I8H[5][1])) {
		if(I8H[5][1] < 1 || I8H[5][1] > window.playlists.playlists.length) {
			if(window.playlists.playlists.length === 0) {
				F5S("You don't have any playlists!", "#cc3333", true);
			}
			F5S("Playlist index must be between 1 and " + (window.playlists.playlists.length), "#cc3333", true);
		}
		else {
			if(u6H[36].map.m.dbv === 2 && u6H[36].map.m.date !== undefined && u6H[36].map.m.date !== null && u6H[36].map.m.date !== "") {
				if(window.playlists.playlists[I8H[5][1] - 1].maps.includes(u6H[36].map.m.dbid)) {
					window.playlists.playlists[I8H[5][1] - 1].maps.splice(window.playlists.playlists[I8H[5][1] - 1].maps.indexOf(u6H[36].map.m.dbid), 1);
					F5S("* Map removed from playlist", "#cc3333", true);
				}
				else {
					q5S();
					window.playlists.playlists[I8H[5][1] - 1].maps.push(u6H[36].map.m.dbid);
					F5S("* Map added to playlist", "#cc3333", true);
				}
			}
			else {
				if(window.playlists.playlists[I8H[5][1] - 1].b1maps.map(e => {return e.id}).includes(u6H[36].map.m.dbid)) {
					window.playlists.playlists[I8H[5][1] - 1].b1maps.splice(window.playlists.playlists[I8H[5][1] - 1].b1maps.map(e => {return e.id}).indexOf(u6H[36].map.m.dbid), 1);
					F5S("* Map removed from playlist", "#cc3333", true);
				}
				else {
					let b1map = {
						id: u6H[36].map.m.dbid,
						name: u6H[36].map.m.n,
						authorname: u6H[36].map.m.a,
						leveldata: T.encodeToDatabase(u6H[36].map),
						vu: u6H[36].map.m.vu,
						vd: u6H[36].map.m.vd,
						remixname: u6H[36].map.m.rxn,
						remixauthor: u6H[36].map.m.rxa,
						remixdb: u6H[36].map.m.rxdb,
						remixid: u6H[36].map.m.rxid,
						publisheddate: u6H[36].map.m.date
					}
					if(u6H[36].map.m.date === undefined || u6H[36].map.m.date === null || u6H[36].map.m.date === "" || u6H[36].map.m.vu * 1 != u6H[36].map.m.vu || u6H[36].map.m.vd * 1 != u6H[36].map.m.vd) {
						F5S("* Map could not be added to the playlist! To add Bonk 1 maps, you need to select the map from by yourself without starting the game. A Bonk 1 map, which is selected from a playlist, cannot be added to a playlist.", "#cc3333", true);
					}
					else {
						window.playlists.playlists[I8H[5][1] - 1].b1maps.push(b1map);
						F5S("* Map added to playlist", "#cc3333", true);
					}
				}
			}
			window.playlists.savePlaylists(window.playlists.playlists);
		}
	}
	else {
		F5S("* List of playlist commands:", "#cc3333", true);
		F5S("/p list", "#cc3333", true);
		F5S("/p [index]", "#cc3333", true);
	}
}
else if(I8H[5][0] == G9b.z43(1869`;

const DROPDOWN_CLICK = `
if (y5k[0][0][y5k[7][1008]] == document.getElementById("maploadtypedropdownoptionplaylists")) {
	o0k[64]["innerHTML"] = document.getElementById("maploadtypedropdownoptionplaylists")["innerHTML"];
	r7h("playlists", true);
	document.getElementById("maploadwindowplaylistbutton").style.display = "block";
	document.getElementById("maploadwindowtoolbox").style.display = "flex";
	document.getElementById("maploadwindowmapscontainer").style.bottom = "28px";
	document.getElementById("maploadwindowmapscontainer").style.height = "calc(100% - 108px - 23px)";
	o0k[28]["style"]["visibility"] = "hidden";
	o0k[12]["style"]["visibility"] = "hidden";
  }
  if(y5k[0][0][y5k[7][1008]] == o0k[38]){`;
const HOTNESS_SLIDER_AND_DROPDOWN_TITLE = `
else if (I0k[0][0] == "playlists") {
	o0k[64]["innerHTML"] = "MY PLAYLISTS";
	o0k[12]["style"]["visibility"] = "hidden";
}else if(I0k[0][0] == G9b.z43(3380)){o0k[64][I0k[6][1036]]=G9b.A43(3399);`
const GET_PLAYLISTS = `
else if (I0k[0][0] == "playlists") {
	o0k[22] = false;

	let newPlaylistButton = {
		name: "NEW PLAYLIST",
		description: "Click here to create a new playlist",
		image: "data:image/png;base64,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",
		maps: "new",
		b1maps: "new"
	};

	let playlistCreator = (list = {name: "", description: "", image: ""}, edit = null) => {
		let newPlaylist = document.createElement("div");
		newPlaylist.classList.add("maploadwindowmapdiv");
		newPlaylist.style.height = "200px";
		
		let encodedImage;
		let image = document.createElement("input");
		image.type = 'file';
		image.style.width = "100%";
		image.style.height = "110.417px";
		image.style.borderWidth = "1px";
		image.style.borderStyle = "solid";
		image.onchange = e => {
			let file = e.target.files[0]; 
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = readerEvent => {
				encodedImage = readerEvent.target.result;
			}
		};
	
		let title = document.createElement("input");
		title.classList.add("maploadwindowtext_picks");
		title.classList.add("maploadwindowtextname_picks");
		title.placeholder = "Playlist Name";
		title.value = list.name;
	
		let description = document.createElement("input");
		description.classList.add("maploadwindowtext_picks");
		description.classList.add("maploadwindowtextcomment_picks");
		description.placeholder = "Playlist Description";
		description.style.top = "150px";
		description.style.height = "60px";
		description.style.height = "19px";
		description.value = list.description;

		let cancelButton = document.createElement("div");
		cancelButton.classList.add("brownButton");
		cancelButton.classList.add("brownButton_classic");
		cancelButton.classList.add("buttonShadow");
		cancelButton.style.width = "calc(50% - 12px)";
		cancelButton.style.height = "25px";
		cancelButton.style.bottom = "5px";
		cancelButton.style.position = "absolute";
		cancelButton.innerText = "CANCEL";
		cancelButton.onclick = () => {
			if(edit !== null) {
				edit.style.display = "";
			}
			newPlaylist.remove();
			document.getElementById("maploadwindowplaylistnew").display = "inline-block";
			window.playlists.editing = false;
		};
		
		let saveButton = document.createElement("div");
		saveButton.classList.add("brownButton");
		saveButton.classList.add("brownButton_classic");
		saveButton.classList.add("buttonShadow");
		saveButton.style.width = "calc(50% - 12px)";
		saveButton.style.height = "25px";
		saveButton.style.bottom = "5px";
		saveButton.style.right = "6px";
		saveButton.style.position = "absolute";
		saveButton.innerText = "SAVE";
		saveButton.onclick = () => {
			if(edit === null) {
				window.playlists.playlists.push({
					name: title.value,
					description: description.value,
					image: encodedImage,
					maps: [],
					b1maps: []
				});
			}
			else {
				window.playlists.playlists[window.playlists.playlists.indexOf(list)] = Object.assign(window.playlists.playlists[window.playlists.playlists.indexOf(list)], {name: title.value, description: description.value, image: encodedImage === undefined ? list.image : encodedImage});
			}
			document.getElementById("maploadtypedropdownoptionplaylists").click();
			document.getElementById("maploadwindowplaylistnew").display = "inline-block";
			window.playlists.editing = false;
		};
	
		newPlaylist.appendChild(image);
		newPlaylist.appendChild(title);
		newPlaylist.appendChild(description);
		newPlaylist.appendChild(cancelButton);
		newPlaylist.appendChild(saveButton);
		return newPlaylist;
	}

	o0k[22] = true;
	for(let list of window.playlists.playlists.concat([newPlaylistButton])) {
		let playlist = document.createElement("div");
		playlist.classList.add("maploadwindowmapdiv");
		if(list != newPlaylistButton) playlist.classList.add("maploadwindowplaylistdiv");
		playlist.style.height = "200px";
		document.getElementById("maploadwindowmapscontainer").appendChild(playlist);
		
		let image = document.createElement("img");
		if(list.image != undefined) {
			image.src = list.image;
		}
		else {
			image.src = "//:0";
		}
		
		image.style.width = "160.6px";
		image.style.height = "110.417px";

		let title = document.createElement("span");
		title.classList.add("maploadwindowtext_picks");
		title.classList.add("maploadwindowtextname_picks");
		title.innerText = list.name;

		let description = document.createElement("span");
		description.classList.add("maploadwindowtext_picks");
		description.classList.add("maploadwindowtextcomment_picks");
		description.style.top = "150px";
		description.style.height = "60px";
		description.innerText = list.description;

		if(list.maps !== "new") {
			let deleteButton = document.createElement("div");
			deleteButton.style.visibility = "hidden";
			deleteButton.style.width = "50px";
			deleteButton.style.padding = "3px";
			deleteButton.style.fontSize = "16px";
			deleteButton.classList.add("maploadwindowdeletebutton");
			deleteButton.classList.add("brownButton");
			deleteButton.classList.add("brownButton_classic");
			deleteButton.classList.add("buttonShadow");
			deleteButton.innerText = "DELETE";
			deleteButton.onclick = () => {
				if(deleteButton.innerText === "DELETE") {
					deleteButton.innerText = "SURE?";
					return;
				}
				playlist.style.opacity = 0.3;
				playlist.style.pointerEvents = "none";
				window.playlists.playlists.splice(window.playlists.playlists.indexOf(list), 1);
			}

			let editButton = document.createElement("div");
			editButton.style.visibility = "hidden";
			editButton.style.left = "10px";
			editButton.style.width = "50px";
			editButton.style.padding = "3px";
			editButton.style.fontSize = "16px";
			editButton.classList.add("maploadwindowdeletebutton");
			editButton.classList.add("brownButton");
			editButton.classList.add("brownButton_classic");
			editButton.classList.add("buttonShadow");
			editButton.innerText = "EDIT";
			editButton.onclick = () => {
				playlist.style.display = "none";
				document.getElementById("maploadwindowmapscontainer").insertBefore(playlistCreator(list, playlist), playlist);
				window.playlists.editing = true;
			}

			let leftButton = document.createElement("div");
			leftButton.style.visibility = "hidden";
			leftButton.classList.add("brownButton");
			leftButton.classList.add("brownButton_classic");
			leftButton.classList.add("buttonShadow");
			leftButton.style.width = "26px";
			leftButton.style.height = "26px"
			leftButton.style.bottom = "10px";
			leftButton.style.left = "10px";
			leftButton.style.position = "absolute";
			leftButton.style.zIndex = 1;
			leftButton.innerText = "<";

			let rightButton = document.createElement("div");
			rightButton.style.visibility = "hidden";
			rightButton.classList.add("brownButton");
			rightButton.classList.add("brownButton_classic");
			rightButton.classList.add("buttonShadow");
			rightButton.style.width = "26px";
			rightButton.style.height = "26px"
			rightButton.style.bottom = "10px";
			rightButton.style.right = "10px";
			rightButton.style.position = "absolute";
			rightButton.style.zIndex = 1;
			rightButton.innerText = ">";

			leftButton.onclick = () => {
				let index = window.playlists.playlists.indexOf(list);
				if(index > 0) {
					window.playlists.playlists[index] = window.playlists.playlists.splice(index - 1, 1, window.playlists.playlists[index])[0];
					playlist.remove();
					document.getElementById("maploadwindowmapscontainer").insertBefore(playlist, document.getElementById("maploadwindowmapscontainer").children[index-1]);
					playlist.onmouseleave();
				}
			}

			rightButton.onclick = () => {
				let index = window.playlists.playlists.indexOf(list);
				if(index < window.playlists.playlists.length - 1) {
					window.playlists.playlists[index] = window.playlists.playlists.splice(index + 1, 1, window.playlists.playlists[index])[0];
					playlist.remove();
					document.getElementById("maploadwindowmapscontainer").insertBefore(playlist, document.getElementById("maploadwindowmapscontainer").children[index+1]);
					playlist.onmouseleave();
				}
			}

			let mergeButton = document.createElement("div");
			mergeButton.style.visibility = "hidden";
			mergeButton.classList.add("brownButton");
			mergeButton.classList.add("brownButton_classic");
			mergeButton.classList.add("buttonShadow");
			mergeButton.style.width = "124px";
			mergeButton.style.height = "52px"
			mergeButton.style.top = "23px";
			mergeButton.style.left = "23px";
			mergeButton.style.position = "absolute";
			mergeButton.style.zIndex = 1;
			mergeButton.style.justifyContent = "center";
			mergeButton.style.display = "flex";
			mergeButton.style.alignItems = "center";

			mergeButton.onclick = () => {
				mergeButton.style.filter = "brightness(1.75)";
				if(window.playlists.merge.from.index === null) {
					window.playlists.merge.from = {
						element: mergeButton,
						index: window.playlists.playlists.indexOf(list)
					}
				}
				else if(window.playlists.merge.from.element === mergeButton) {
					mergeButton.style.removeProperty("filter");
					window.playlists.merge.from = {
						element: null,
						index: null
					}
				}
				else {
					if(mergeButton.innerText !== "SURE?") {
						mergeButton.innerText = "SURE?";
						return;
					}
					window.playlists.merge.to = {
						element: mergeButton,
						index: window.playlists.playlists.indexOf(list)
					}
					window.playlists.playlists[window.playlists.merge.to.index].b1maps = [...new Set(window.playlists.playlists[window.playlists.merge.from.index].b1maps.concat(window.playlists.playlists[window.playlists.merge.to.index].b1maps))];
					window.playlists.playlists[window.playlists.merge.to.index].maps = [...new Set(window.playlists.playlists[window.playlists.merge.from.index].maps.concat(window.playlists.playlists[window.playlists.merge.to.index].maps))];
					window.playlists.playlists.splice(window.playlists.merge.from.index, 1);
					window.playlists.merge.from.element.parentElement.style.opacity = 0.3;
					window.playlists.merge.from.element.parentElement.style.pointerEvents = "none";
					window.playlists.savePlaylists(window.playlists.playlists);

					window.playlists.merge.from.element.style.removeProperty("filter");
					window.playlists.merge.from.element.style.visibility = "hidden";
					window.playlists.merge.to.element.style.removeProperty("filter");
					window.playlists.merge.to.element.style.visibility = "hidden";
					document.getElementById("maploadwindowplaylistmerge").click();
				}
			}

			playlist.onmouseenter = () => {
				if(window.playlists.editing) return;
				if(window.playlists.edit) {
					deleteButton.style.visibility = "inherit";
					editButton.style.visibility = "inherit";
					leftButton.style.visibility = "inherit";
					rightButton.style.visibility = "inherit";
				}
				else if(window.playlists.merge.enabled && window.playlists.merge.from.element !== mergeButton) {
					if(window.playlists.merge.from.index === null) {
						mergeButton.innerText = "MERGE FROM";
					}
					else {
						mergeButton.innerText = "MERGE TO";
						mergeButton.style.removeProperty("filter");
					}
					mergeButton.style.visibility = "inherit";
				}
			}
			playlist.onmouseleave = () => {
				deleteButton.style.visibility = "hidden";
				editButton.style.visibility = "hidden";
				leftButton.style.visibility = "hidden";
				rightButton.style.visibility = "hidden";
				if(window.playlists.merge.from.element !== mergeButton && window.playlists.merge.to.element !== mergeButton)
					mergeButton.style.visibility = "hidden";
			}

			playlist.appendChild(deleteButton);
			playlist.appendChild(editButton);
			playlist.appendChild(leftButton);
			playlist.appendChild(rightButton);
			playlist.appendChild(mergeButton);
		}
		else {
			playlist.id = "maploadwindowplaylistnew";
			playlist.style.display = window.playlists.edit ? "inline-block" : "none";
		}
		playlist.appendChild(image);
		playlist.appendChild(title);
		playlist.appendChild(description);
		playlist.onclick = (e) => {
			if((list.maps.length + list.b1maps.length) > 0 && list.maps !== "new" && !window.playlists.edit && !window.playlists.merge.enabled) {
				if(e.target.classList.contains("brownButton")) return;
				while(document.getElementById("maploadwindowmapscontainer").firstChild) {
					document.getElementById("maploadwindowmapscontainer").firstChild.remove();
					document.getElementById("maploadwindowtoolbox").style.display = "none";
					document.getElementById("maploadwindowmapscontainer").style.removeProperty("bottom");
					document.getElementById("maploadwindowmapscontainer").style.removeProperty("height");
				}
				document.getElementById("maploadwindowstatustext").style.visibility = "inherit";
				let addMaps = (offset = 0) => {
					$["post"]("https://bonk2.io/scripts/map_getfave.php", {
						token: o0k[7],
						startingfrom: offset * 32
					}) ["done"](function (h0i, Y0i) {
						var X0k = [arguments];
						if (X0k[0][0]["r"] != "success") {
							W7h("Fetch error");
						} else if (X0k[0][0]["r"] == "success") {
							let filteredMapList = X0k[0][0];
							filteredMapList.maps = filteredMapList.maps.map(e => {if(list.maps.includes(e.id)) {return e;}}).sort().slice(0, list.maps.length);
							document.getElementById("maploadwindowstatustext").style.visibility = "hidden";

							n2h(filteredMapList);
							if(X0k[0][0]["more"]) {
								addMaps(offset + 1);
							}
							else {
								n2h({r: "success", maps: list.b1maps, more: false});
							}
						}
					})
				}
				addMaps();
			}
			else if(list.maps === "new" && !window.playlists.editing) {
				playlist.style.display = "none";
				document.getElementById("maploadwindowmapscontainer").insertBefore(playlistCreator(), playlist);
			}
		}
	}

	document.getElementById("maploadwindowstatustext").style.visibility = "hidden";
}
else if(I0k[0][0] == G9b.A43(3380)){o0k[22]=false;`