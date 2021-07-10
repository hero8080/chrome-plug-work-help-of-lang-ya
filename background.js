// chrome.notifications.create(null, {
// 	type: 'basic',
// 	iconUrl: 'icons/icon.png',
// 	title: '这是标题',
// 	message: '您刚才点击了自定义右键菜单！'
// });

chrome.tabs.onUpdated.addListener(function(tabId, status, tab) {
	// if(status.status=="loading"&&tab.url.substring(0,21)=='https://os.cntytz.com'){
		console.log(tab.url)
	if(tab.url.substring(0,21)=='https://os.cntytz.com'){
		console.log(2)
		chrome.browserAction.setIcon({path:"icons/icon_s.png"});
		//处理网页样式
		// chrome.tabs.executeScript({
		//   code: 'document.body.style.backgroundColor="red"'
		// });
		// chrome.tabs.executeScript({
		//   code: 'document.getElementsByTagName("html")[0]=""'
		// });
		// console.log(status);
		// chrome.tabs.executeScript(null, {file: "rebuild/init.js"});
	}else{
		chrome.browserAction.setIcon({path:"icons/icon.png"});
	}
});
