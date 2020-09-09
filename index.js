'use strict'

const fetchPosition = require('./lib/fetch-position')
const {EventEmitter} = require('events')
const {Readable} = require('stream')

const livePositionsAsEventEmitter = (opt = {}) => {
	const {interval} = {interval: 3 * 1000, ...opt}
	const out = new EventEmitter()

	const fetch = () => {
		fetchPosition()
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
	const {interval} = {interval: 3 * 1000, ...opt}

	const fetch = async () => {
		try {
			const data = await fetchPosition()
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

module.exports = {
	fetchPosition,
	asEventEmitter: livePositionsAsEventEmitter,
	asStream: livePositionsAsReadableStream,
}
