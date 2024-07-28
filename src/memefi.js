// ==UserScript==
// @name         Memefi Bot [SmartBot]
// @namespace    https://smartbot.black/
// @version      1.0.0
// @description  Bot for playing memefi in telegram
// @author       Smartbot Team
// @match        https://tg-app.memefi.club/*
// @icon         https://www.memefi.club/images/favicons/android-chrome-96x96.png?v=5
// @grant        none
// ==/UserScript==

(() => {
	let isRun = false;

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getEnergy() {
		return (
			(document
				.querySelector('[alt="Energy"]')
				?.nextSibling?.querySelector("span")
				?.innerText?.replace(",", "") ?? 0) * 1
		);
	}
	function getMaxEnergy() {
		return (
			(document
				.querySelector('[alt="Energy"]')
				?.nextSibling?.querySelector("span:nth-child(2)")
				?.innerText?.replace(",", "")
				?.replace("/", "") ?? 0) * 1
		);
	}

	function clickAtRandomIntervals(minX, maxX, minY, maxY, minDelay, maxDelay) {
		function clickRandom() {
			const x = getRandomInt(minX, maxX);
			const y = getRandomInt(minY, maxY);

			const pointerEventInit = {
				pointerId: 1,
				bubbles: true,
				cancelable: true,
				composed: true,
				view: window,
				detail: 1,
				screenX: x,
				screenY: y,
				clientX: x,
				clientY: y,
				ctrlKey: false,
				altKey: false,
				shiftKey: false,
				metaKey: false,
				button: 0,
				buttons: 1,
				pointerType: "touch",
				width: 1,
				height: 1,
				pressure: 0.5,
				tangentialPressure: 0,
				tiltX: 0,
				tiltY: 0,
				twist: 0,
				isPrimary: true,
			};

			const element = document.elementFromPoint(x, y);

			if (element) {
				const pointerDownEvent = new PointerEvent(
					"pointerdown",
					pointerEventInit,
				);
				element.dispatchEvent(pointerDownEvent);

				console.log(`Pointer down at (${x}, ${y}) on element:`, element);
			} else {
				console.log(`No element found at (${x}, ${y})`);
			}

			// Make random pause before next click
			const delay = getRandomInt(minDelay, maxDelay);
			if (getEnergy() > (getRandomInt(5, 20) / 100) * getMaxEnergy()) {
				setTimeout(clickRandom, delay);
			} else {
				isRun = false;
			}
		}

		clickRandom();
	}

	function start() {
		const buttonsTop = document
			.querySelector('[role="group"]')
			.getBoundingClientRect();
		const buttonsLeft = document
			.querySelector("canvas")
			.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.getBoundingClientRect();
		const buttonsBottom = document
			.querySelector("canvas")
			.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.getBoundingClientRect();

		clickAtRandomIntervals(
			buttonsLeft.x + buttonsLeft.width + 10,
			document.body.scrollWidth - buttonsLeft.x - buttonsLeft.width - 10,
			buttonsTop.y + buttonsTop.height + 10,
			buttonsBottom.y - 10,
			25,
			750,
		);
	}

	setInterval(() => {
		if (!isRun && getEnergy() > (getRandomInt(70, 90) / 100) * getMaxEnergy()) {
			isRun = true;
			start();
		}

		[...document.querySelectorAll("button")]
			.find((button) => button.innerText.includes("CONTINUE PLAYING"))
			?.click();
	}, 1e4);
})();
