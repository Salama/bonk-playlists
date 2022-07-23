//Add click event listener
newStr = newStr.replace(`R9S[56][W3b[6][630]]=C1L;`, `R9S[56][W3b[6][630]]=C1L;document.getElementById("maploadtypedropdownoptionplaylists").onclick=C1L;`);

//Make dropdown option visible
newStr = newStr.replace(`R9S[56][H8o[9][459]][H8o[9][1019]]=H1N.D$J(3533);`, `R9S[56][H8o[9][459]][H8o[9][1019]]=H1N.D$J(3533);document.getElementById("maploadtypedropdownoptionplaylists").style.display="block";`);

//Make droopdown option invisible
newStr = newStr.replace(`R9S[56][k3x[5][459]][k3x[5][1019]]=H1N.L77(1030);`, `R9S[56][k3x[5][459]][k3x[5][1019]]=H1N.L77(1030);document.getElementById("maploadtypedropdownoptionplaylists").style.display="none";`);

//First dropdown list selection check
newStr = newStr.replace(`if(R49[0][0][R49[3][1008]] == R9S[46]){`, DROPDOWN_CLICK);

//Disable hotness slider and set dropdown title
newStr = newStr.replace(`else if(w$u[0][0] == H1N.L77(3001)){`, HOTNESS_SLIDER_AND_DROPDOWN_TITLE);

newStr = newStr.replace(`else if(w$u[0][0] == H1N.L77(3001)){R9S[33]=false;`, GET_PLAYLISTS);

//Add commands
newStr = newStr.replace(`if(N_B[6][0] == H1N.L77(1120)`, PLAYLIST_COMMANDS);

//Hide back button when a dropdown menu item is selected. It will be made visible later
newStr = newStr.replace(`function C1L(f$9){`, `function C1L(f$9){
    document.getElementById("maploadwindowplaylistbutton").style.display="none";
    document.getElementById("maploadwindowtoolbox").style.display="none";`);

//Prevent playlists from appearing when scrolling
newStr = newStr.replace(`if(R9S[17] == H1N.L77(2642) || R9S[17] == H1N.D$J(2723) || R9S[17] == H1N.D$J(2576))`, PLAYLIST_SCROLL);

//Get token
newStr = newStr.replace(`R9S[6]=R9S[0][0];`, `R9S[6]=R9S[0][0];window.playlists.setToken(R9S[0][0]);`);

//Disable fav
newStr = newStr.replace(`var r9q`, `if(window.playlists.autofav){e6L("* Favoriting maps while autofav is on has been disabled because it can cause problems", "#cc3333", true);return;}` + `var r9q`);

//Add playlists command to help message
newStr = newStr.replace('F21[90][N_B[7][644]](H1N.L77(2535),H1N.L77(1536),false);', 'F21[90][N_B[7][644]](H1N.L77(2535),H1N.L77(1536),false);F21[90].showStatusMessage("/p - commands from playlists mod","#cc3333",false);');

//Remove no maps message when using playlists
const noMaps = [...new Set(newStr.match(/F$m\(...\....\(1857\)\)/g))];

for(let message of noMaps) {
    newStr = newStr.replaceAll(message, `if(document.getElementById("maploadtypedropdowntitle").textContent !== "MY PLAYLISTS")` + message);
}
