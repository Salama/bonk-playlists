patchCounter = 0;
const patch = (a, b) => {
	c = newStr;
	newStr = newStr.replace(a, b);
	//console.log(`Patch ${patchCounter++}: ${c === newStr ? 'fail' : 'success'}`);
	return c !== newStr;
}

const categoryFunc = newStr.match(/[A-Za-z0-9\$_]{3}\([A-Za-z0-9\$_]{3}\.[A-Za-z0-9\$_]{3}\([0-9]*\),true\)/)[0].substr(0,3);
patch(`function ${categoryFunc}`, `window.playlists.categoryFunc=${categoryFunc};function ${categoryFunc}`);

//Get map loader
let mapLoader = newStr.match(/function [A-Za-z0-9\$_]{3}.{0,500}try{\(function\(\){.{1000}/g);
for(let loader of mapLoader) {
	if(loader.match("=2")) {
		mapLoader = loader;
		break;
	};
}
mapLoader = mapLoader.split("(")[0].split(" ")[1];
patch(`function ${mapLoader}`, `window.playlists.mapLoader=${mapLoader};function ${mapLoader}`);

//Get token
patch('[1,10000,25000,100000,500000,8000000,5000000000];', '[1,10000,25000,100000,500000,8000000,5000000000];' + "window.playlists.setToken(arguments[0]);");

//Mapload ready variable
let readyVar = newStr.match(/\+ 1000 && [A-Za-z0-9\$_]{3}\[[0-9+]+\]/)[0].split(" ")[3];
patch('[1,10000,25000,100000,500000,8000000,5000000000];', '[1,10000,25000,100000,500000,8000000,5000000000];' + `window.playlists.setMapsLoaded=a=>{${readyVar}=a;};`);

//Mapload finish variable
let finishVar = newStr.match(/false\);\}else \{if\([A-Za-z0-9\$_]{3}\[[0-9]+\]\)\{/)[0].split(/[\(\)]/)[2];
//Inverting the value is important
patch('[1,10000,25000,100000,500000,8000000,5000000000];', '[1,10000,25000,100000,500000,8000000,5000000000];' + `window.playlists.setMapsFinished=a=>{${finishVar}=!a;};`);

//Get some useful functions
let menuRegex = newStr.match(/== 13\){...\(\);}}/)[0];
patch(menuRegex, menuRegex + "window.playlists.menuFunctions = this;");
let toolRegex = newStr.match(/=new [A-Za-z0-9\$_]{1,3}\(this,[A-Za-z0-9\$_]{1,3}\[0\]\[0\],[A-Za-z0-9\$_]{1,3}\[0\]\[1\]\);/);
patch(toolRegex, toolRegex + "window.playlists.toolFunctions = this;");

//Big class
let bigClass = newStr.match(/[A-Z]\[[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[0-9]+\]\]\([A-Za-z0-9\$_]{1,3}\[0\]\[0\]\);[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[A-Za-z0-9\$_]{1,3}\[[0-9]+\]\[[0-9]+\]\]\([A-Za-z0-9\$_]{1,3}\[[0-9]+\],{m:/)[0][0];
patch(`function ${bigClass}(){}`, `function ${bigClass}(){};window.playlists.bigClass=${bigClass};`);


