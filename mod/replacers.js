//Add click event listener
newStr = newStr.replace(`o0k[15][F5k[9][630]]=n7h;`, `o0k[15][F5k[9][630]]=n7h;document.getElementById("maploadtypedropdownoptionplaylists").onclick=n7h;`);

//Make dropdown option visible
newStr = newStr.replace(`o0k[15][P5k[5][459]][P5k[5][1019]]=G9b.A43(2280);`, `o0k[15][P5k[5][459]][P5k[5][1019]]=G9b.A43(2280);document.getElementById("maploadtypedropdownoptionplaylists").style.display="block";`);

//Make droopdown option invisible
newStr = newStr.replace(`o0k[15][N0k[7][459]][N0k[7][1019]]=G9b.A43(1767);`, `o0k[15][N0k[7][459]][N0k[7][1019]]=G9b.A43(1767);;document.getElementById("maploadtypedropdownoptionplaylists").style.display="none";`);

//First dropdown list selection check
newStr = newStr.replace(`if(y5k[0][0][y5k[7][1008]] == o0k[38]){`, DROPDOWN_CLICK);

//Disable hotness slider and set dropdown title
newStr = newStr.replace(`else if(I0k[0][0] == G9b.z43(3380)){o0k[64][I0k[6][1036]]=G9b.A43(3399);`, HOTNESS_SLIDER_AND_DROPDOWN_TITLE);

newStr = newStr.replace(`else if(I0k[0][0] == G9b.A43(3380)){o0k[22]=false;`, GET_PLAYLISTS);

//Add commands
newStr = newStr.replace(`if(I8H[5][0] == G9b.z43(1869`, PLAYLIST_COMMANDS);

//Hide back button when a dropdown menu item is selected. It will be made visible later
newStr = newStr.replace(`function n7h(R3E){`, `function n7h(R3E){
    document.getElementById("maploadwindowplaylistbutton").style.display="none";
    document.getElementById("maploadwindowplaylistimport").style.display="none";
    document.getElementById("maploadwindowplaylistexport").style.display="none";`);

//Prevent playlists from appearing when scrolling
newStr = newStr.replace(`if(o0k[65] == G9b.A43(3378) || o0k[65] == G9b.z43(3395) || o0k[65] == G9b.z43(3379))`, PLAYLIST_SCROLL);
