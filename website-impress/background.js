
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
	
var prY=9.5;

var ICON_WIDTH = 20;
var LINE_WIDTH = 1;
var imageData = context.getImageData(0, 0, ICON_WIDTH-1, ICON_WIDTH-1);


function UpdateObject() {
	this.url = "",
	this.domain = "",
	this.tabId = 0,
	this.displayValue="?",
	this.baiduKoubeiRank = 0,
	this.baiduKoubeiTagMap = {},
	this.rank_out_rect = [0, 4, ICON_WIDTH-1, 7.5], //  x, y , width, heigh


	this.getIcon=function(){ 
		// context.fillStyle = 'blue';
		// 适应icon的宽度
        var baiduKoubeiWidth = parseInt(this.baiduKoubeiRank)/10.0 * ((ICON_WIDTH - LINE_WIDTH * 2) / 10.0);		if(this.baiduKoubeiRank >= 80){
			context.fillStyle = 'green';
		}else if(this.baiduKoubeiRank >=60){
			context.fillStyle = 'orange';
		}else{
			context.fillStyle = 'red';
		}
		context.clearRect(this.rank_out_rect[0], this.rank_out_rect[1], 
			this.rank_out_rect[2], this.rank_out_rect[3]);
		context.fillRect(this.rank_out_rect[0], this.rank_out_rect[1], 
			baiduKoubeiWidth, this.rank_out_rect[3]);
		context.strokeStyle ="#000";
		context.lineWidth = LINE_WIDTH;
		context.strokeRect(this.rank_out_rect[0], this.rank_out_rect[1], 
			this.rank_out_rect[2], this.rank_out_rect[3]);

		var imageData = context.getImageData(0, 0, 19, 19);
		return imageData;
	},

	this.getBaiduImpress=function(host){
		// sync 
		var url = "https://koubei.baidu.com/s/" + host;
		jQuery.ajax({
			url: url, 
			async: false,
			success: this.handlerBaiduImpress.bind(this)
		});
	},

	this.handlerBaiduImpress=function(data){
		// console.log(data);
		var $ = jQuery;
		tag_map = {};
		var $jQueryObject = $($.parseHTML(data));

		var regex = /(.+)\s(\d+)/;  // such "好评 3"
		var webRank = $jQueryObject.find('.praise-text').attr('data-num');

		$.each($jQueryObject.find(".kb-tags-list .tag-item"), function(idx, item){
			var text = $(item).text().trim();
			if(text == "全部"){
				return;
			}
			var matchs = regex.exec(text);
			tag_map[matchs[1]] = matchs[2];
		});
		console.log("webrank=" + webRank);
		console.log(tag_map);
		this.displayValue = webRank;
		this.baiduKoubeiTagMap = tag_map; 
		this.baiduKoubeiRank = parseInt(webRank);
	},

	this.setURL=function(url,tabId){
		var domain = url.match(/^(http|https):\/\/([\w.]+)(:\d+)?/);
		this.url = url;
		this.domain = domain[2];
		this.tabId = tabId; 	
		this.getBaiduImpress(this.domain);

		this.updateIcon();
		
	},
	this.updateIcon=function(){
		var icon = this.getIcon();
		var displayValue = this.displayValue || '?';
		var title = displayValue == '?' ? (this.domain + ' 暂时没有收录百度口碑值')
                		 : this.domain + (" 百度口碑好评率 " + this.displayValue + "%");
		var tabId = this.tabId;
		chrome.browserAction.setBadgeText({text: displayValue, 'tabId': tabId});
		chrome.browserAction.setBadgeBackgroundColor({color: displayValue == '?' ? [190, 190, 190, 230] : [208, 0, 24, 255], 'tabId': tabId});
		chrome.browserAction.setTitle({title: title, 'tabId': tabId});
		chrome.browserAction.setIcon({imageData: icon, 'tabId': tabId});
	}

}
