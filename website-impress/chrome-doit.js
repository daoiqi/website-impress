String.prototype.format = function()
{
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
        function(m,i){
            return args[i];
        });
}

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

chrome.contextMenus.create({
    id: 'enableQuickSwitch',
    title: "打开百度口碑网页",
    contexts: ["browser_action"],
    onclick: function(info, tab){
        var url = tab.url;
        var domain = url.match(/^(http|https):\/\/([\w.]+)(:\d+)?/)[2];
        url = 'https://koubei.baidu.com/s/';
        var finalUrl = url + encodeURIComponent(domain);
        console.log(finalUrl);
        chrome.tabs.create({url: finalUrl});
    },
});


chrome.contextMenus.create({
    title: "反馈问题",
    contexts: ["browser_action"],
    onclick: function(e){
        var url = 'https://github.com/daoiqi/website-impress/issues/new?title=&body=';
        var finalUrl = url;
        try{
            var extensionVersion = chrome.runtime.getManifest().version;
            var env = {
                extensionVersion: extensionVersion,
                projectVersion: extensionVersion,
                userAgent: navigator.userAgent,
            };
            var body = ["\n\n",
                "<!-- ↑请在此行上方填写问题/建议详情，可用中文↑ -->\n",
                "Website Impress {0}\n".format(env.projectVersion),
                "{0}\n".format(env.userAgent)
            ].join(".");

            finalUrl = url + encodeURIComponent(body);
            var err = localStorage['logLastError'];
            if(err){
                body += "\n```\n{0}\n```".format(err);
                finalUrl = (url + encodeURIComponent(body)).substr(0, 2000);
            }
            chrome.tabs.create({url: finalUrl});
        }catch(er){
            console.log(er);
        }

    }
})
