(function() {


var options = {
	uiKey: {
		key: 16
	},
	filter: {
		limitLength: 30
	},
	speakerTools: {

		ttsUrlPattern: "http://translate.google.cn/translate_tts?ie=UTF-8&q=<content>&tl=ja",
		translateUrlPattern: "http://translate.google.cn/translate_a/single?client=t&sl=ja&tl=zh-CN&hl=zh-CN&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&dt=sw&ie=UTF-8&oe=UTF-8&oc=1&otf=2&srcrom=1&ssel=4&tsel=0&q=<content>"
	}
}

var uiKey = {
	init: function() {
		this.audioObject = null
		this.initEvents()
	},
	initEvents: function() {
		window.addEventListener("keydown", this.onKeyPressed.bind(this))
	},
	onKeyPressed: function(evt) {
		if (evt.which !== options.uiKey.key) { return }
		this.playVoice()
	},
	playVoice: function() {
		var content = speakerTools.getSelectedContent()
		if (!this.filter(content)) { return }
		this.speak(content)
	},
	filter: function(content) {
		var len = options.filter.limitLength
		if (content.trim().length === 0) { return false }
		if (content.length > len) {
			console.warn("content has words more than %s.".replace("%s", len))
			return false
		}
		return true
	},
	speak: function(content) {
		console.info("word:", content)
		var au = this.getAudioObject()
		var voiceUrl = speakerTools.getVoiceUrl(content)
		au.setSource(voiceUrl)
		au.play()
	},
	getAudioObject: function() {
		if (!this.audioObject) {
			this.audioObject = new AudioIframe()
		}
		return this.audioObject
	}
}

var speakerTools = {
	getSelectedContent: function() {
		var selection = window.getSelection()
		var content = selection.toString()
		return content
	},
	getVoiceUrl: function(content) {
		var urlPat = options.speakerTools.ttsUrlPattern
		var newContent = encodeURIComponent(content)
		var url = urlPat.replace("<content>", newContent)
		return url
	},

	// @deprecated
	getTranslate: function(content, callback) {
		var urlPat = options.speakerTools.translateUrlPattern
		var newContent = encodeURIComponent(content)
		var url = urlPat.replace("<content>", newContent)

		var res,
			self = this
		ajax.get(url, function(data) {
			res = self.constructData(data)
			callback(res)
		})
	},
	// @deprecated
	constructData: function(data) {
		var res = {
			"origin": data[0][0][1],
			"result": data[0][0][0],
			"input": data[0][1][3]
		}
		return res
	}
}


var AudioIframe = function() {
	this.init()
}
AudioIframe.prototype = {
	init: function() {
		this.iframe = this.createIframe()
		this.source = ""
	},
	createIframe: function() {
		var iframe = document.createElement("iframe")
		iframe.setAttribute("width", 0)
		iframe.setAttribute("height", 0)
		document.body.appendChild(iframe)
		return iframe
	},
	setSource: function(url) {
		this.source = url
	},
	play: function() {
		this.iframe.setAttribute("src", this.source)
	}
}

var AudioObject = function() {
	this.init()
}
AudioObject.prototype = {
	init: function() {
		this.target = this.createAudio()
	},
	createAudio: function() {
		var audio = document.createElement("audio")
		return audio
	},

	/**/

	play: function() {
		this.target.play()
	},
	pause: function() {
		this.target.pause()
	},
	stop: function() {
		this.pause()
		this.rewind()
	},
	seek: function(time) {
		this.target.currentTime = parseFloat(time)
	},
	rewind: function() {
		this.target.currentTime = 0.0
	},

	/**/

	destory: function() {
		this.target.setAttribute("src", "")
	},
	setSource: function(url) {
		this.target.setAttribute("src", url)
	}
}

// @deprecated
var ajax = {
	get: function(url, succFn, failFn) {
		var xhr = new XMLHttpRequest()
		xhr.open("GET", url, true)
		xhr.onreadystatechange = function(evt) {
			if (xhr.readyState !== 4) { return }
			if (xhr.status === 200) {
				succFn(xhr.responseText)
			} else {
				failFn(xhr.statusText)
			}
		}
		xhr.send(null)
	}
}


/* main start */

uiKey.init()

console.log("[OKAY] selectToSpeak script loaded!")

// window.sts = {
// 	"uiKey": uiKey,
// 	"speakerTools": speakerTools,
// 	"AudioObject": AudioObject,
// 	"ajax": ajax
// }

})()
