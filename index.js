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
	}

	let timer = setInterval(fetch, interval)
	out.stop = () => {
		if (timer === null) return;
		clearInterval(timer)
		timer = null
	}

	return out
}

const livePositionsAsReadableStream = (opt = {}) => {
	const {interval} = {interval: 3 * 1000, ...opt}

	const fetch = () => {
		fetchPosition()
		.then(data => out.push(data))
		.catch(err => out.destroy(err))
	}
	let timer = setInterval(fetch, interval)

	const out = new Readable({
		objectMode: true,
		read: () => {},
		destroy: (err, cb) => {
			if (timer !== null) {
				clearInterval(timer)
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
