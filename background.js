// chrome.notifications.create(null, {
// 	type: 'basic',
// 	iconUrl: 'icons/icon.png',
// 	title: '这是标题',
// 	message: '您刚才点击了自定义右键菜单！'
// });

chrome.tabs.onUpdated.addListener(function (tabId, status, tab) {
    // if(status.status=="loading"&&tab.url.substring(0,21)=='https://os.cntytz.com'){
    console.log(tab.url)
    if (tab.url.substring(0, 21) == 'https://os.cntytz.com') {
        console.log(2)
        chrome.browserAction.setIcon({path: "icons/icon_s.png"});
        //处理网页样式
        // chrome.tabs.executeScript({
        //   code: 'document.body.style.backgroundColor="red"'
        // });
        // chrome.tabs.executeScript({
        //   code: 'document.getElementsByTagName("html")[0]=""'
        // });
        // console.log(status);
        // chrome.tabs.executeScript(null, {file: "rebuild/init.js"});
    } else {
        chrome.browserAction.setIcon({path: "icons/icon.png"});
    }
});

const textTranslate = (info, tab) => {
    console.log(info, tab);
    open('https://os.cntytz.com/write','_blank')
}

const parentMenu = chrome.contextMenus.create({
    id: 'writeRZ',
    title: '写日志(日志助手提供)',
    contexts: ["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]
});

chrome.contextMenus.onClicked.addListener(textTranslate);

var timer=null
let time=0
//每半个小时循环一次
//到5点25以后每分钟提醒一次

setInterval(function (){
    clearInterval(timer)
    let currentData=new Date()
    let comStartDate=new Date(currentData.getFullYear(),currentData.getMonth(),currentData.getDate(),17,10,0)
    let comEndDate=new Date(currentData.getFullYear(),currentData.getMonth(),currentData.getDate(),17,30,0)
    //是否到时间了
    let isTimeLoad=
        currentData.getTime()-comStartDate.getTime()>0
        &&
        comEndDate.getTime()-currentData.getTime()>0

    if(!time&&isTimeLoad){
        postMsg()
        time++
        setInterval(function (){
            if(time>5){
                clearInterval(timer)
                time=0
                return
            }
            postMsg()
            time++
        },1000*60*2)
    }
},1000*60*10)
// },1000)

function postMsg(){
    chrome.notifications.create(parseInt(1000+Math.random()*8888)+'',{
        type:'basic',
        iconUrl:chrome.runtime.getURL("pro_icon/92.png"),
        title : "写日志提醒",
        message: new Date().toLocaleString(),
    })
}
