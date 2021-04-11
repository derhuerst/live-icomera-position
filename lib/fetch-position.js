'use strict'

const {stringify} = require('query-string')
const Promise = require('pinkie-promise')
const {fetch} = require('fetch-ponyfill')({Promise})
const parseJsonp = require('parse-jsonp')

const endpoint = 'https://www.ombord.info/api/jsonp/position/?'
const userAgent = 'https://github.com/derhuerst/live-icomera-position'

const fetchPosition = async (opt = {}) => {
	const url = endpoint + stringify({
		callback: 'cb',
		_: Date.now()
	})

	// todo: force resolving DNS using WiFi-local DNS server
	const res = await fetch(url, {
		redirect: 'follow',
		cache: 'no-store',
		headers: {
			accept: 'application/json',
			'user-agent': userAgent,
			referrer: 'todo' // todo
		},
		timeout: 2500,
		...opt
	})
	if (!res.ok) {
		const err = new Error(res.statusText || 'unknown error')
		err.statusCode = res.status
		err.res = res
		throw err
	}

	const _ = parseJsonp('cb', await res.text())

	const data = {
		latitude: _.latitude ? parseFloat(_.latitude) : null,
		longitude: _.longitude ? parseFloat(_.longitude) : null,
		altitude: _.altitude ? parseFloat(_.altitude) : null,
		speed: _.speed ? Math.round(parseFloat(_.speed) * 3.6) : null,
		cmg: _.cmg || null, // todo: what is this?
		nrOfSatellites: _.satellites ? parseInt(_.satellites) : null,
		mode: _.mode || null,
	}
	Object.defineProperty(data, 'raw', {value: _})
	return data
}

module.exports = fetchPosition
