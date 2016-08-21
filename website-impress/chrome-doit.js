
chrome.browserAction.setBadgeBackgroundColor({color: [210, 210, 210, 230]});
chrome.browserAction.setBadgeText({text: '?'});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,tab) {
    console.log(changeInfo);
    if( changeInfo.status == 'loading' ){
        var url = tab.url;
        var updateobj = new UpdateObject();
        
        if(url != undefined) {
            var domain = url.match(/^(http|https):\/\/([\w.]+)(:\d+)?/);
            if(domain != null) {
                //try{
                updateobj.setURL(tab.url.split('#')[0], tabId);
                //}catch(err){
                //    console.log(err);
                //}
            } else{
                //updatePR('?', url, tabId,0);
            }
        }
    }
    
});