'use strict'

const ndjson = require('ndjson')
const {asEventEmitter, asStream} = require('.')

const onError = (err) => {
	console.error(err)
	process.exit(1)
}

// const positions1 = asStream()
// positions1.pipe(ndjson.stringify()).pipe(process.stdout)
// positions1.on('error', onError)

const positions2 = asEventEmitter()
positions2.on('data', data => console.log(data))
positions2.on('error', onError)
