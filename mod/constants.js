let dropdownOption = document.createElement('div');
let playlistsButton = document.createElement('div');
let importButton = document.createElement('div');
let exportButton = document.createElement('div');
//Insert before favs
document.getElementById("maploadtypedropdown").insertBefore(dropdownOption, document.getElementById("maploadtypedropdownoption1"));
document.getElementById("maploadwindow").appendChild(playlistsButton);
document.getElementById("maploadwindow").appendChild(importButton);
document.getElementById("maploadwindow").appendChild(exportButton);

dropdownOption.outerHTML = `<div class="dropdown-option dropdown_classic" id="maploadtypedropdownoptionplaylists" style="display: none;">MY PLAYLISTS</div>`;
playlistsButton.outerHTML = `<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistbutton" onclick="document.getElementById(&quot;maploadtypedropdownoptionplaylists&quot;).click();" style="position: absolute; left: 210px; line-height: 23px; height: 23px; width: 75px; top: 57px; display: block;">BACK</div>`;
importButton.outerHTML = `<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistimport" style="position: absolute; left: 290px; line-height: 23px; height: 23px; width: 75px; top: 57px; display: block;">IMPORT</div>`;
exportButton.outerHTML = `<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistexport" style="position: absolute; left: 370px; line-height: 23px; height: 23px; width: 75px; top: 57px; display: block;">EXPORT</div>`;

document.getElementById("maploadwindowplaylistexport").addEventListener("click", () => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(new Blob([localStorage.getItem("playlists")], {type: "oclet/stream"}));
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
            localStorage.setItem("playlists", readerEvent.target.result);
        }
    };
    a.click();
    document.body.removeChild(a);
})

document.getElementById("newbonklobby_mapbutton").addEventListener("click", () => {
    if(document.getElementById("maploadtypedropdowntitle").innerText === "MY PLAYLISTS") {
        document.getElementById("maploadwindowplaylistbutton").style.display = "block";
        document.getElementById("maploadwindowplaylistimport").style.display = "block";
        document.getElementById("maploadwindowplaylistexport").style.display = "block";
    }
    else {
        document.getElementById("maploadwindowplaylistbutton").style.display = "none";
        document.getElementById("maploadwindowplaylistimport").style.display = "none";
        document.getElementById("maploadwindowplaylistexport").style.display = "none";
    }
});

PLAYLIST_SCROLL = `
if(o0k[65] == "playlists") {return;} else if(o0k[65] == G9b.A43(3378) || o0k[65] == G9b.z43(3395) || o0k[65] == G9b.z43(3379))`;

PLAYLIST_COMMANDS = `
if (I8H[5][0] == "/p") {
	let playlists = JSON.parse(localStorage.getItem("playlists"));
	if(I8H[5][1] == "list") {
		F5S("Saved playlists", "#cc3333", true);
		for(let i = 0; i < playlists.length; i++) {
			F5S("* [" + i + "] " + playlists[i].name, "#cc3333", true);
		}
	}
	else if(!isNaN(I8H[5][1])) {
		if(I8H[5][1] < 0 || I8H[5][1] >= playlists.length) {
			if(playlists.length === 0) {
				F5S("You don't have any playlists!", "#cc3333", true);
			}
			F5S("Playlist index must be between 0 and " + (playlists.length - 1), "#cc3333", true);
		}
		else {
			if(u6H[36].map.m.dbv === 2 && u6H[36].map.m.date !== undefined && u6H[36].map.m.date !== null && u6H[36].map.m.date !== "") {
				if(playlists[I8H[5][1]].maps.includes(u6H[36].map.m.dbid)) {
					playlists[I8H[5][1]].maps.splice(playlists[I8H[5][1]].maps.indexOf(u6H[36].map.m.dbid), 1);
					F5S("* Map removed from playlist", "#cc3333", true);
				}
				else {
					q5S();
					playlists[I8H[5][1]].maps.push(u6H[36].map.m.dbid);
					F5S("* Map added to playlist", "#cc3333", true);
				}
			}
			else {
				if(playlists[I8H[5][1]].b1maps.map(e => {return e.id}).includes(u6H[36].map.m.dbid)) {
					playlists[I8H[5][1]].b1maps.splice(playlists[I8H[5][1]].b1maps.map(e => {return e.id}).indexOf(u6H[36].map.m.dbid), 1);
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
						remixid: u6H[36].map.m.rxid
					}
					if(u6H[36].map.m.date === undefined || u6H[36].map.m.date === null || u6H[36].map.m.date === "" || u6H[36].map.m.vu * 1 != u6H[36].map.m.vu || u6H[36].map.m.vd * 1 != u6H[36].map.m.vd) {
						F5S("* Map could not be added to the playlist! To add Bonk 1 maps, you need to select the map from by yourself without starting the game. A Bonk 1 map, which is selected from a playlist, cannot be added to a playlist.", "#cc3333", true);
					}
					else {
						playlists[I8H[5][1]].b1maps.push(b1map);
						F5S("* Map added to playlist", "#cc3333", true);
					}
				}
			}
			localStorage.setItem("playlists", JSON.stringify(playlists));
		}
	}
	else {
		F5S("* List of playlist commands:", "#cc3333", true);
		F5S("/p list", "#cc3333", true);
		F5S("/p [index]", "#cc3333", true);
	}
}
else if(I8H[5][0] == G9b.z43(1869`;

DROPDOWN_CLICK = `
if (y5k[0][0][y5k[7][1008]] == document.getElementById("maploadtypedropdownoptionplaylists")) {
	o0k[64]["innerHTML"] = document.getElementById("maploadtypedropdownoptionplaylists")["innerHTML"];
	r7h("playlists", true);
	document.getElementById("maploadwindowplaylistbutton").style.display = "block";
	document.getElementById("maploadwindowplaylistimport").style.display = "block";
	document.getElementById("maploadwindowplaylistexport").style.display = "block";
	o0k[28]["style"]["visibility"] = "hidden";
	o0k[12]["style"]["visibility"] = "hidden";
  }
  if(y5k[0][0][y5k[7][1008]] == o0k[38]){`;
HOTNESS_SLIDER_AND_DROPDOWN_TITLE = `
else if (I0k[0][0] == "playlists") {
	o0k[64]["innerHTML"] = "MY PLAYLISTS";
	o0k[12]["style"]["visibility"] = "hidden";
}else if(I0k[0][0] == G9b.z43(3380)){o0k[64][I0k[6][1036]]=G9b.A43(3399);`
GET_PLAYLISTS = `
else if (I0k[0][0] == "playlists") {
	o0k[22] = false;
	let playlists = JSON.parse(localStorage.getItem("playlists"));

	if(playlists == null) playlists = [];
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
				playlists.push({
					name: title.value,
					description: description.value,
					image: encodedImage,
					maps: [],
					b1maps: []
				});
			}
			else {
				playlists[playlists.indexOf(list)] = Object.assign(playlists[playlists.indexOf(list)], {name: title.value, description: description.value, image: encodedImage === undefined ? list.image : encodedImage});
			}
			localStorage.setItem("playlists", JSON.stringify(playlists));
			document.getElementById("maploadtypedropdownoptionplaylists").click();
		};

		newPlaylist.appendChild(image);
		newPlaylist.appendChild(title);
		newPlaylist.appendChild(description);
		newPlaylist.appendChild(cancelButton);
		newPlaylist.appendChild(saveButton);
		return newPlaylist;
	}

	o0k[22] = true;
	for(let list of playlists.concat([newPlaylistButton])) {
		let playlist = document.createElement("div");
		playlist.classList.add("maploadwindowmapdiv");
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
				playlists.splice(playlists.indexOf(list), 1);
				localStorage.setItem("playlists", JSON.stringify(playlists));
			}

			let editButton = document.createElement("div");
			editButton.style.visibility = "hidden";
			editButton.style.left = "10px";
			editButton.classList.add("maploadwindowdeletebutton");
			editButton.classList.add("brownButton");
			editButton.classList.add("brownButton_classic");
			editButton.classList.add("buttonShadow");
			editButton.innerText = "EDIT";
			editButton.onclick = () => {
				playlist.style.display = "none";
				document.getElementById("maploadwindowmapscontainer").insertBefore(playlistCreator(list, playlist), playlist);
			}

			playlist.onmouseenter = () => {
				deleteButton.style.visibility = "inherit";
				editButton.style.visibility = "inherit";
			}
			playlist.onmouseleave = () => {
				deleteButton.style.visibility = "hidden";
				editButton.style.visibility = "hidden";
			}

			playlist.appendChild(deleteButton);
			playlist.appendChild(editButton);
		}
		playlist.appendChild(image);
		playlist.appendChild(title);
		playlist.appendChild(description);
		playlist.onclick = (e) => {
			if((list.maps.length + list.b1maps.length) > 0 && list.maps !== "new") {
				if(e.target.classList.contains("brownButton")) return;
				while(document.getElementById("maploadwindowmapscontainer").firstChild) {
					document.getElementById("maploadwindowmapscontainer").firstChild.remove();
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
			else if(list.maps === "new") {
				document.getElementById("maploadwindowmapscontainer").insertBefore(playlistCreator(), playlist);
			}
		}
	}

	document.getElementById("maploadwindowstatustext").style.visibility = "hidden";
}
else if(I0k[0][0] == G9b.A43(3380)){o0k[22]=false;`