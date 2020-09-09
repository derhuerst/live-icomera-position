# live-icomera-position

**Live vehicle geolocation, taken from the on-board Icomera WiFi system.**

[![npm version](https://img.shields.io/npm/v/live-icomera-position.svg)](https://www.npmjs.com/package/live-icomera-position)
[![build status](https://api.travis-ci.org/derhuerst/live-icomera-position.svg?branch=master)](https://travis-ci.org/derhuerst/live-icomera-position)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/live-icomera-position.svg)
![minimum Node.js version](https://img.shields.io/node/v/live-icomera-position.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installation

```shell
npm install live-icomera-position
```


## Usage

`asStream()` returns a [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) in [object mode](https://nodejs.org/api/stream.html#stream_object_mode).

```js
const {asStream} = require('live-icomera-position')
const ndjson = require('ndjson')

const positions = asStream()
positions.on('error', console.error)
positions
.pipe(ndjson.stringify())
.pipe(process.stdout)
```

An individual data point will look like this:

```js
{
	latitude: 50.9069,
	longitude: 7.0649,
	altitude: 36.9,
	speed: 97, // km/h
	nrOfSatellites: 8,
	mode: '3' // see below
}
```

You can also use the [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter)-based API:

```js
const {asEventEmitter} = require('live-icomera-position')

const positions = asEventEmitter()
positions.on('error', console.error)
positions.on('data', data => console.log(data))
```

### Mode

The mode value in a datapoint appears familiar with the one a widespread gps client called GPSD uses.
We don't have any confirmation that the icomera system uses GPSD, but if it did the mode values would mean following:
| Value | State                          |
|-------|--------------------------------|
| 0     | no value seen.                 |
| 1     | no position.                   |
| 2     | 2D position, no altitude.      |
| 3     | 3D position, altitude present. |

source: [GPSD Documentation](https://gpsd.gitlab.io/gpsd/gpsd_json.html)

## Contributing

If you have a question or need support using `live-icomera-position`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/live-icomera-position/issues).
