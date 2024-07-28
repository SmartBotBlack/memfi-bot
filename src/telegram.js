// ==UserScript==
// @name         Telegram path for Memefi Bot [SmartBot]
// @namespace    https://smartbot.black/
// @version      1.0.0
// @description  A script for telegram that helps you run memefi game directly in your browser.
// @author       Smartbot Team
// @match        https://web.telegram.org/*
// @icon         https://telegram.org/img/favicon.ico
// @grant        none
// ==/UserScript==

(() => {
	const modifyIframeUrl = (iframe) => {
		const url = new URL(iframe.src);
		const hashParams = new URLSearchParams(url.hash.slice(1));

		if (
			url.host.includes("tg-app.memefi.club") &&
			hashParams.has("tgWebAppPlatform") &&
			hashParams.get("tgWebAppPlatform") !== "ios"
		) {
			hashParams.set("tgWebAppPlatform", "ios");
			url.hash = `#${hashParams.toString()}`;
			iframe.src = url.toString();
		}
	};

	const observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === "childList") {
				for (const node of mutation.addedNodes) {
					if (node.tagName === "IFRAME") {
						modifyIframeUrl(node);
					} else if (node.querySelectorAll) {
						node.querySelectorAll("iframe").forEach(modifyIframeUrl);
					}
				}
			}
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });

	document.querySelectorAll("iframe").forEach(modifyIframeUrl);
})();
