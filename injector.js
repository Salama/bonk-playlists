function playlistsInjector(str){
	
	document.addEventListener("returnPlaylists", (e) => {
		localStorage.setItem("playlists", e.detail);
	})
	var letPlaylistsEventEvent = new CustomEvent('storePlaylists', {"detail":["get"]});
	document.dispatchEvent(letPlaylistsEventEvent);

	let dropdownOption = document.createElement('div');
	let playlistsButton = document.createElement('div');
	//Insert before favs
	document.getElementById("maploadtypedropdown").insertBefore(dropdownOption, document.getElementById("maploadtypedropdownoption1"));
	document.getElementById("maploadwindow").appendChild(playlistsButton);

	dropdownOption.outerHTML = `<div class="dropdown-option dropdown_classic" id="maploadtypedropdownoptionplaylists" style="display: none;">MY PLAYLISTS</div>`;
	playlistsButton.outerHTML = `<div class="brownButton brownButton_classic buttonShadow" id="maploadwindowplaylistbutton" onclick="document.getElementById(&quot;maploadtypedropdownoptionplaylists&quot;).click();" style="position: absolute; left: 210px; line-height: 23px; height: 23px; width: 75px; top: 57px; display: block;">BACK</div>`;

	document.getElementById("newbonklobby_mapbutton").addEventListener("click", () => {
		if(document.getElementById("maploadtypedropdowntitle").innerText === "MY PLAYLISTS") {
			document.getElementById("maploadwindowplaylistbutton").style.display = "block";
		}
		else {
			document.getElementById("maploadwindowplaylistbutton").style.display = "none";
		}
	});

	let newStr = str;
	
	//Add click event listener
	newStr = newStr.replace(`G3p[38][V1p[9][630]]=t9W;`, `G3p[38][V1p[9][630]]=t9W;document.getElementById("maploadtypedropdownoptionplaylists").onclick=t9W;`)

	//Make dropdown option visible
	newStr = newStr.replace(`G3p[38][u1p[6][459]][u1p[6][1019]]=S9L.W1E(2279);`, `G3p[38][u1p[6][459]][u1p[6][1019]]=S9L.W1E(2279);document.getElementById("maploadtypedropdownoptionplaylists").style.display="block";`)

	//Make droopdown option invisible
	newStr = newStr.replace(`G3p[38][R1p[8][459]][R1p[8][1019]]=S9L.W1E(1766);`, `G3p[38][R1p[8][459]][R1p[8][1019]]=S9L.W1E(1766);document.getElementById("maploadtypedropdownoptionplaylists").style.display="none";`)

	//First dropdown list selection check
	newStr = newStr.replace(`if(i1p[0][0][i1p[1][1008]] == G3p[12]){`, DROPDOWN_CLICK);
	
	//Disable hotness slider and set dropdown title
	newStr = newStr.replace(`else if(w3p[0][0] == S9L.C1E(3353)){G3p[67][w3p[6][1036]]=S9L.C1E(3372);`, HOTNESS_SLIDER_AND_DROPDOWN_TITLE);

	newStr = newStr.replace(`else if(w3p[0][0] == S9L.C1E(3353)){G3p[81]=false;`, GET_PLAYLISTS);

	//Add commands
	newStr = newStr.replace(`if(t7V[7][0] == S9L.W1E(1868)){`, PLAYLIST_COMMANDS);

	//Hide back button when a dropdown menu item is selected. It will be made visible later
	newStr = newStr.replace(`function t9W(n7i){`, `function t9W(n7i){document.getElementById("maploadwindowplaylistbutton").style.display="none";`);

	//Prevent playlists from appearing when scrolling
	newStr = newStr.replace(`if(G3p[49] == S9L.W1E(3351) || G3p[49] == S9L.C1E(3368) || G3p[49] == S9L.C1E(3352))`, PLAYLIST_SCROLL);

	if(str === newStr) throw "Injection failed!";
	console.log("Playlists injector run");
	return newStr;
}

const PLAYLIST_SCROLL = `
if(G3p[49] == "playlists") {return;} else if(G3p[49] == S9L.W1E(3351) || G3p[49] == S9L.C1E(3368) || G3p[49] == S9L.C1E(3352))`;

const PLAYLIST_COMMANDS = `
if (t7V[7][0] == "/p") {
	let playlists = JSON.parse(localStorage.getItem("playlists"));
	if(t7V[7][1] == "list") {
		d8I("Saved playlists", "#cc3333", true);
		for(let i = 0; i < playlists.length; i++) {
			d8I("* [" + i + "] " + playlists[i].name, "#cc3333", true);
		}
	}
	else if(!isNaN(t7V[7][1])) {
		if(t7V[7][1] < 0 || t7V[7][1] > playlists.length) {
			d8I("Playlist index must be between 0 and " + (playlists.length - 1), "#cc3333", true);
		}
		else {
			if(j0V[23].map.m.dbv === 2 && j0V[23].map.m.date !== undefined && j0V[23].map.m.date !== null && j0V[23].map.m.date !== "") {
				if(playlists[t7V[7][1]].maps.includes(j0V[23].map.m.dbid)) {
					playlists[t7V[7][1]].maps.splice(playlists[t7V[7][1]].maps.indexOf(j0V[23].map.m.dbid), 1);
					d8I("* Map removed from playlist", "#cc3333", true);
				}
				else {
					b8I();
					playlists[t7V[7][1]].maps.push(j0V[23].map.m.dbid);
					d8I("* Map added to playlist", "#cc3333", true);
				}
			}
			else {
				if(playlists[t7V[7][1]].b1maps.map(e => {return e.id}).includes(j0V[23].map.m.dbid)) {
					playlists[t7V[7][1]].b1maps.splice(playlists[t7V[7][1]].b1maps.map(e => {return e.id}).indexOf(j0V[23].map.m.dbid), 1);
					d8I("* Map removed from playlist", "#cc3333", true);
				}
				else {
					let b1map = {
						id: j0V[23].map.m.dbid,
						name: j0V[23].map.m.n,
						authorname: j0V[23].map.m.a,
						leveldata: W.encodeToDatabase(j0V[23].map),
						vu: j0V[23].map.m.vu,
						vd: j0V[23].map.m.vd,
						remixname: j0V[23].map.m.rxn,
						remixauthor: j0V[23].map.m.rxa,
						remixdb: j0V[23].map.m.rxdb,
						remixid: j0V[23].map.m.rxid
					}
					if(j0V[23].map.m.date === undefined || j0V[23].map.m.date === null || j0V[23].map.m.date === "" || j0V[23].map.m.vu * 1 != j0V[23].map.m.vu || j0V[23].map.m.vd * 1 != j0V[23].map.m.vd) {
						d8I("* Map could not be added to the playlist! To add Bonk 1 maps, you need to select the map from by yourself without starting the game. A Bonk 1 map, which is selected from a playlist, cannot be added to a playlist.", "#cc3333", true);
					}
					else {
						playlists[t7V[7][1]].b1maps.push(b1map);
						d8I("* Map added to playlist", "#cc3333", true);
					}
				}
			}
			localStorage.setItem("playlists", JSON.stringify(playlists));
			document.dispatchEvent(new CustomEvent('storePlaylists', {"detail":["set", JSON.stringify(playlists)]}));
		}
	}
	else {
		d8I("* List of playlist commands:", "#cc3333", true);
		d8I("/p list", "#cc3333", true);
		d8I("/p [index]", "#cc3333", true);
	}
}
else if(t7V[7][0] == S9L.W1E(1868)){`;

const DROPDOWN_CLICK = `
if (i1p[0][0][i1p[1][1008]] == document.getElementById("maploadtypedropdownoptionplaylists")) {
	G3p[67][i1p[1][1036]] = document.getElementById("maploadtypedropdownoptionplaylists")[i1p[1][1036]];
	R9W("playlists", true);
	document.getElementById("maploadwindowplaylistbutton").style.display = "block";
	G3p[76][i1p[1][459]][i1p[1][458]] = S9L.W1E(820);
	G3p[64][i1p[1][459]][i1p[1][458]] = S9L.W1E(820);
  }
  if(i1p[0][0][i1p[1][1008]] == G3p[12]){`;
const HOTNESS_SLIDER_AND_DROPDOWN_TITLE = `
else if (w3p[0][0] == "playlists") {
	G3p[67][w3p[6][1036]] = "MY PLAYLISTS";
	G3p[64][w3p[6][459]][w3p[6][458]] = S9L.C1E(820);
} else if (w3p[0][0] == S9L.C1E(3353)) {
	G3p[67][w3p[6][1036]] = S9L.C1E(3372);`
const GET_PLAYLISTS = `
else if (w3p[0][0] == "playlists") {
	G3p[81] = false;
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
			document.dispatchEvent(new CustomEvent('storePlaylists', {"detail":["set", JSON.stringify(playlists)]}));
			document.getElementById("maploadtypedropdownoptionplaylists").click();
		};

		newPlaylist.appendChild(image);
		newPlaylist.appendChild(title);
		newPlaylist.appendChild(description);
		newPlaylist.appendChild(cancelButton);
		newPlaylist.appendChild(saveButton);
		return newPlaylist;
	}

	G3p[81] = true;
	for(let list of playlists.concat([newPlaylistButton])) {
		let playlist = document.createElement("div");
		playlist.classList.add("maploadwindowmapdiv");
		playlist.style.height = "200px";
		document.getElementById("maploadwindowmapscontainer").appendChild(playlist);

		let image = document.createElement("img");
		image.src = list.image;
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
				document.dispatchEvent(new CustomEvent('storePlaylists', {"detail":["set", JSON.stringify(playlists)]}));
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
					$[w3p[6][656]](S9L.W1E(3382), {
						token: G3p[5],
						startingfrom: offset * 32
					}) [w3p[6][655]](function (h0i, Y0i) {
						S9L.X9L();
						var d3p = [
							arguments
						];
						d3p[5] = y3uu;
						if (d3p[0][0][d3p[5][61]] != S9L.W1E(1936)) {
							e9W(S9L.C1E(3380));
						} else if (d3p[0][0][d3p[5][61]] == S9L.W1E(1936)) {
							let filteredMapList = d3p[0][0];
							filteredMapList.maps = filteredMapList.maps.map(e => {if(list.maps.includes(e.id)) {return e;}}).sort().slice(0, list.maps.length);
							document.getElementById("maploadwindowstatustext").style.visibility = "hidden";

							t7W(filteredMapList);
							if(d3p[0][0].more) {
								addMaps(offset + 1);
							}
							else {
								t7W({r: "success", maps: list.b1maps, more: false});
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
else if(w3p[0][0] == S9L.C1E(3353)){G3p[81]=false;`

/*else if (w3p[0][0] == "playlists") {
	G3p[81] = false;
	$[w3p[6][656]](S9L.W1E(3382), {
	  token: G3p[5],
	  startingfrom: G3p[80] * 32
	}) [w3p[6][655]](function (h0i, Y0i) {
	  S9L.X9L();
	  var d3p = [
		arguments
	  ];
	  d3p[5] = y3uu;
	  G3p[81] = true;
	  if (d3p[0][0][d3p[5][61]] != S9L.W1E(1936)) {
		e9W(S9L.C1E(3380));
	  } else if (d3p[0][0][d3p[5][61]] == S9L.W1E(1936)) {
		t7W(d3p[0][0]);
		G3p[41] = d3p[0][0][d3p[5][1399]];
	  }
	}) [w3p[6][654]](function (v0i, n0i, g7i) {
	  var K3p = [
		arguments
	  ];
	});
}*/
if(!window.bonkCodeInjectors)
window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return playlistsInjector(bonkCode);
	} catch (error) {
		alert(
`Whoops! Playlists was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
Playlists, such as the Bonk Leagues Client. You would have to disable it to use \
Playlists.
		`);
		throw error;
	}
});

console.log("Playlists injector loaded");
