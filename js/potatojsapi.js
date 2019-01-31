(function (G, D) {
	if (G.pcpay) { return 'ok'; }
	//var agent = navigator.userAgent.toLowerCase();
	//var pt = navigator.platform.toLowerCase();
	//var potato = ;
	function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
	function calcPos(w, h) {
		var x, y;
		x = G.screenLeft + (G.innerWidth - w) / 2;
		y = G.screenTop + (G.innerHeight - h) / 2;
		return { x: x, y: y };
	}
	function _ready(callback) {
		if ('PotatoJSBridge' in G) {
			callback();
		} else if ('invokeHandler' in G) {
			var f1 = function () {
				D.removeEventListener('PotatoJSBridgeReady', f1, false);
				callback();
			}
			D.addEventListener('PotatoJSBridgeReady', f1, false);
		} else {
			var f2 = function () {
				D.removeEventListener('DOMContentLoaded', f2, false);
				callback();
			}
			D.addEventListener('DOMContentLoaded', f2, false);
		}
	}
	function _payment(pcpay_tid, callback) {
		if ('function' !== typeof callback) {
			callback = function () { };
		}
		if (!/^[0-9]{1,20}$/i.test(pcpay_tid)) {
			return callback(Error('Param error'));
		}
		if ('PotatoJSBridge' in G) {
			PotatoJSBridge.invoke('payment', {
				order: pcpay_tid
			}, function (r) {
				callback(void 0, JSON.parse(r));
			});
		} else {
			let pos = calcPos(480, 640);
			var url = 'https://wallet.pcpay.me/payment/' + pcpay_tid;
			var win = window.open(url, 'pcpay', 'width=480,height=640,resizable=no,dialog=yes,alwaysRaised=on,left=' + pos.x + ',top=' + pos.y);
			if (win) {
				if (win.focus) {
					win.focus();
				}
				var timer = setInterval(() => {
					if (win.closed) {
						clearInterval(timer);
						callback({});
					}
				}, 100);
			}
		}
	}

	var _pcpay_api = Object.create(null);
	Object.defineProperty(_pcpay_api, 'ready', { value: _ready });
	Object.defineProperty(_pcpay_api, 'payment', { value: _payment });
	Object.defineProperty(G, 'pcpay', {
		get: function () { return _pcpay_api; }
	});

	return 'ok';
})(window, document);
