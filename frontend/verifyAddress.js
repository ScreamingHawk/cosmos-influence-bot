/* global ethers */
/* eslint-disable no-console */
document.addEventListener('DOMContentLoaded', () => {

	// Update message
	function renderMessage(message) {
		let messageEl = document.getElementById('message')
		messageEl.innerHTML = message
	}
	// Remove message
	function clearMessage() {
		return renderMessage('')
	}
	// Update message with error
	function renderError(err) {
		console.log(err)
		console.log(Object.keys(err))
		let message = err
		if (err.code && err.reason) {
			message = `${err.code}: ${err.reason}`
		} else if (err.code && err.message) {
			message = `${err.code}: ${err.message}`
		}
		message = `<code class="error">${message}</code>`
		return renderMessage(message)
	}

	// Check MetaMask installed
	if (typeof window.ethereum === 'undefined') {
		console.log('MetaMask is not installed!')
		return renderMessage('You need to install <a href=“https://metmask.io“>MetaMask</a> to complete verification.')
	}

	// Get the query params
	let username, address
	const qs = window.location.search.substr(1)
	qs.split('&').forEach(q => {
		const [ k, v ] = q.split('=')
		if (k === 'username') {
			username = v
		} else if (k === 'address') {
			address = v
			document.getElementById('address').innerText = address
		}
	})
	if (!username || !address){
		console.log('Missing query params')
		return renderMessage('Invalid link! Please check your link and try again.')
	}

	// Show first section
	document.getElementById('connectFlex').classList.remove('gone')
	clearMessage()

	// Connection button
	const connectButton = document.getElementById('connect')
	connectButton.addEventListener('click', async () => {
		try {
			await window.ethereum.enable()
		} catch (err) {
			return renderError(err)
		}
		// Show next section
		clearMessage()
		document.getElementById('connectFlex').classList.add('gone')
		document.getElementById('signFlex').classList.remove('gone')
		document.getElementById('footer').classList.remove('gone')
	})

	// Verify button
	const signButton = document.getElementById('sign')
	signButton.addEventListener('click', async () => {
		const msg = `${username} owns ${address}`
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		let signature
		try {
			signature = await signer.signMessage(msg)
		} catch (err) {
			return renderError(err)
		}
		const signingAddr = ethers.utils.verifyMessage(msg, signature)
		if (signingAddr !== address) {
			return renderError('Please sign the request with the correct address')
		}
		// Update signature and show
		clearMessage()
		document.getElementById('signature').innerText = signature
		document.getElementById('signFlex').classList.add('gone')
		document.getElementById('thanksFlex').classList.remove('gone')
	})

	let DONATE_ADDR = '0x455fef5aeCACcd3a43A4BCe2c303392E10f22C63'
	let tipButton = document.getElementById('donate')

	tipButton.addEventListener('click', async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		let amount = document.getElementById('amount').value
		amount = ethers.FixedNumber.from(amount)
		amount = ethers.constants.WeiPerEther.mul(amount)
		try {
			await signer.sendTransaction({
				to: DONATE_ADDR,
				value: amount,
			})
		} catch (err) {
			return renderError(err)
		}
		renderMessage('<h3>❤️ Thank you SO much for your donation!! ❤️</h3>')
	})

	console.log('loaded')

})
