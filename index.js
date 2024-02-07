import {EventEmitter} from 'node:events'
import {Readable} from 'node:stream'
import {fetchPosition} from './lib/fetch-position.js'

const livePositionsAsEventEmitter = (opt = {}) => {
	const {
		interval,
		timeout,
	} = {
		interval: 3000, // 3s
		timeout: 2500, // 2.5s
		...opt,
	}
	const out = new EventEmitter()

	const fetch = () => {
		fetchPosition({timeout})
		.then(data => out.emit('data', data))
		.catch(err => out.emit('error', err))
		timer = setTimeout(fetch, interval)
	}
	let timer = setTimeout(fetch, interval)

	out.stop = () => {
		if (timer === null) return;
		clearTimeout(timer)
		timer = null
	}

	return out
}

const livePositionsAsReadableStream = (opt = {}) => {
	const {
		interval,
		timeout,
	} = {
		interval: 3000, // 3s
		timeout: 2500, // 2.5s
		...opt,
	}

	const fetch = async () => {
		try {
			const data = await fetchPosition({timeout})
			out.push(data)
		} catch (err) {
			out.destroy(err)
			return;
		}
		timer = setTimeout(fetch, interval)
	}
	let timer = setTimeout(fetch, interval)

	const out = new Readable({
		objectMode: true,
		read: () => {},
		destroy: (err, cb) => {
			if (timer !== null) {
				clearTimeout(timer)
				timer = null
			}
			cb(err)
		}
	})
	return out
}

export {
	fetchPosition,
	livePositionsAsEventEmitter as asEventEmitter,
	livePositionsAsReadableStream as asStream,
}
