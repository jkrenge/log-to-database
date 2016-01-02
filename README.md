> Persistent write-only logging of requests, events, cycles, and loads to a database, it's basically written in stone.

TOC: [Overview](#overview), [Setup](#setup), [Events that can be logged](#event-types-to-log), [Advanced](#callbacks), [Contribute](#contribute)

# Overview
Supports two engines: `MongoDB` (default and recommended), and `MySQL` (alpha, limited functionality).

# Setup
As listed in `samples/log.js`. First init the logger:

```
const WrittenInStone = require('../index.js');
const stonePlate = new WrittenInStone('mongodb', {
  path: 'mongodb://localhost/pl_tracking'
});
```

# Event types to log
Then you can log an `event` with certain fixed attributes per type, and a `payload`. Following `event` types exist:

Type                  | Fixed attributes             | Usage
:-------------------- | :--------------------------- | :--------------------------------------------------------
[Activity](#activity) | `activity`                   | Atomic events like *email sent*
[Status](#status)     | `key`, `value`               | Values that change over time like *load of queue*
[Request](#request)   | `requester`, `requested`     | Requests of resources like *requested endpoint*
[Cycle](#cycle)       | `type`, `identifier`, `step` | Incremental monitoring like *endqueued*, then *processed*

## Activity
An `activity` logs the firing of some atomic function.

The `activity` acts as a category, additional information can be logged in the `payload`, e.g. if an email is sent.

```
const activity = 'email-sent';

var payload = {
  to: 'recipient@test.com',
  from: 'sender@test.com'
};

stonePlate.engraveActivity(activity, payload);
```

## Status
A `status` reflects the current state of the application.

The `key` is the variable of which the snapshot should be made, the `value` represents the snapshot itself, i.e. its current status. With the `payload`, any additional information can be logged. This makes sense to e.g. log the current waiting jobs in a queue (redis).

```
const key = 'queue-waiting-jobs';
var value = getNumberOfJobsInQueue();

var payload = {
  env: process.env.NODE_ENV
};

stonePlate.engraveStatus(key, value, payload);
```

## Request
A `request` logs, as the name suggests, a request of a resource.

The `requester` is the requesting entity, e.g. the users IP address in an Express.js service. `requested` represents the requested resource, e.g. a fixed name for a certain service. Within the `payload` additional information can be stored.

**Note:** So far, only the `event` type `request` is supported with MySQL as persistence.

```
const requested = 'name-of-this-resource';
var requester = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

var payload = {
  query: req.query
};

stoneLog.request(requester, requested, payload);
```

## Cycle
A `cycle` event is one step in the processing of a certain object. E.g. if a document from the database is processed in several steps, each `step` can be enumerated.

The `type` described the kind of cycle. The `identifier` is unique for the cycle. The `step` represents the current progress. The combination of `identifier` and `step` is required to be unique.

```
// after enqueueing a job
const type = 'render-images';
var identifier = job.id;
var step = 0;

var payload = {
  imageSource: 'user-upload'
}

stonePlate.engraveCycle(type, identifier, step, payload);
```

Then, in a later step:

```
// in the queue worker after processing is done
const type = 'render-images';
var identifier = job.id;
var step = 1;

stonePlate.engraveCycle(type, identifier, step, null);
```

# Callbacks
Every `.engraveX()` has a `callback` as optional last parameter.

```
stonePlate.engraveActivity('something-happened', null, function (err) {
  console.log(err);
});
```

# Contribute

This is all dirty. ✋ If you want to help, please do.

Licensed as [MIT](http://opensource.org/licenses/MIT), uses
[async](https://github.com/caolan/async),
[mongoose](http://mongoosejs.com/),
[node-mysql](https://github.com/felixge/node-mysql),
[underscore](http://underscorejs.org/).
