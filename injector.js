function injector(str){

	

	if(str === newStr) throw "Injection failed!";
	console.log("Playlists injector run");
	return newStr;
}

if(!window.bonkCodeInjectors)
window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
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
