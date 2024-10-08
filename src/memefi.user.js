// ==UserScript==
// @name         Memefi Bot [SmartBot]
// @namespace    https://smartbot.black/
// @version      1.6.0
// @description  Bot for playing memefi in telegram
// @author       Smartbot Team
// @match        https://tg-app.memefi.club/*
// @icon         https://www.memefi.club/images/favicons/android-chrome-96x96.png?v=5
// @grant        none
// ==/UserScript==

(() => {
	let isRun = false;
	const LAST_RUN_CLAIM = "lastRunClaim";

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getEnergy() {
		return (
			(document
				.querySelector('g[clip-path="url(#clip0_21455_16555)"]')
				?.parentElement?.nextSibling?.querySelector("span")
				?.innerText?.replace(",", "") ?? 0) * 1
		);
	}

	function getMaxEnergy() {
		return (
			(document
				.querySelector('g[clip-path="url(#clip0_21455_16555)"]')
				?.parentElement?.nextSibling?.querySelector("span:nth-child(2)")
				?.innerText?.replace(",", "")
				?.replace("/", "") ?? 0) * 1
		);
	}

	const createTouch = (target, x, y) =>
		new Touch({
			identifier: Date.now(),
			target,
			clientX: x,
			clientY: y,
			radiusX: 2.5,
			radiusY: 2.5,
			rotationAngle: 0,
			force: 0.5,
		});

	const runSlots = async () => {
		const buttonSlot = document.querySelector(".pulse-blue-animation button");
		const countSlot = buttonSlot.parentElement.nextSibling.innerText;
		if (countSlot.includes(":") || countSlot * 1 < 10) {
			return;
		}

		try {
			buttonSlot.click();

			await new Promise((res) => setTimeout(res, getRandomInt(10, 20) * 1000));

			const avaliableSlot =
				document.querySelector('svg[viewBox="0 0 44 44"]').nextSibling
					.innerText * 1;

			if (avaliableSlot > 0) {
				const btn = [...document.querySelectorAll("button")].find((button) =>
					button.innerText.includes("SPIN"),
				);

				const x = 10;
				const y = 10;

				const touchstartEvent = new TouchEvent("touchstart", {
					bubbles: true,
					cancelable: true,
					touches: [createTouch(btn, x, y)],
					targetTouches: [createTouch(btn, x, y)],
					changedTouches: [createTouch(btn, x, y)],
				});

				btn.dispatchEvent(touchstartEvent);
			}

			await new Promise((res) => setTimeout(res, getRandomInt(20, 40) * 1000));
		} catch (err) {
			console.error(err);
		} finally {
			window.location.replace("/");
		}
	};

	const tapBot = async () => {
		try {
			[...document.querySelectorAll("p")]
				.find((p) => p.innerText.includes("Boosters"))
				.click();
			await new Promise((res) => setTimeout(res, getRandomInt(10, 20) * 1000));

			const runTapBot = async () => {
				const tapBot = [...document.querySelectorAll("h5")].find((p) =>
					p.innerText.includes("TAP BOT"),
				);
				const available = Number.parseInt(
					(
						tapBot.nextSibling.querySelectorAll("span")[2] ||
						tapBot.nextSibling.querySelectorAll("span")[1]
					).innerText.split("/")[0],
				);
				if (available > 0) {
					tapBot.click();
					await new Promise((res) =>
						setTimeout(res, getRandomInt(10, 20) * 1000),
					);

					const claimBtn = [...document.querySelectorAll("p")].find((p) =>
						p.innerText.includes("CLAIM COINS"),
					);
					const activateBtn = [...document.querySelectorAll("p")].find((p) =>
						p.innerText.includes("ACTIVATE BOT"),
					);

					if (activateBtn) {
						activateBtn?.click();
						await new Promise((res) =>
							setTimeout(res, getRandomInt(10, 20) * 1000),
						);
					} else if (claimBtn) {
						claimBtn?.click();
						await new Promise((res) =>
							setTimeout(res, getRandomInt(10, 20) * 1000),
						);
						await runTapBot();
					}
				}
			};

			await runTapBot();
		} catch (err) {
			console.error(err);
		} finally {
			window.location.replace("/");
		}
	};

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
			5,
			650,
		);
	}

	const repeater = async () => {
		try {
			if (
				!isRun &&
				getEnergy() > (getRandomInt(70, 90) / 100) * getMaxEnergy()
			) {
				isRun = true;
				start();
			}

			try {
				// Close btn
				[...document.querySelectorAll('g[id*="Close"]')]
					.map((el) => el?.parentElement?.parentElement)
					.map((el) => el?.click());
			} catch (err) {
				console.error(err);
			}

			try {
				// Close promo
				document
					.querySelector('div[role="presentation"] button svg[width="30"]')
					?.parentElement?.click();
			} catch (err) {
				console.error(err);
			}

			try {
				const reloadBtn = [...document.querySelectorAll("button")].find(
					(button) => button.innerText.includes("RELOAD BOT"),
				);

				if (reloadBtn) {
					reloadBtn.click();
					await new Promise((res) => setTimeout(res, 10 * 1e3));
				}
			} catch (err) {
				console.error(err);
			}

			[...document.querySelectorAll("button")]
				.find((button) => button.innerText.includes("CONTINUE PLAYING"))
				?.click();

			if (!isRun) {
				try {
					await runSlots();
				} catch (err) {
					console.error(err, "runSlots");
				}
			}

			const lastRunTime = Number.parseInt(
				localStorage.getItem(LAST_RUN_CLAIM) || "0",
				10,
			);
			if (!isRun && Date.now() - lastRunTime >= 60 * 60 * 1000) {
				await tapBot();
				localStorage.setItem(LAST_RUN_CLAIM, Date.now().toString());
			}
		} catch (e) {
			console.error(e);
		}

		setTimeout(() => {
			requestAnimationFrame(repeater);
		}, 1e4);
	};

	setTimeout(() => {
		requestAnimationFrame(repeater);
	}, 1e4);
})();
