---
layout: blog
date: 2014-08-25
title: MQWeb use case
excerpt: KBC is using MQWeb to help their developers
---
[KBC](https://www.kbc.be) uses [MQWeb](https://fbraem.github.io/mqweb/) to help their developers
to get status information from their queues and channels.
---
An internal website is created with [CakePHP](https://www.cakephp.org) to get an overview of all available
queuemanagers. Once a queuemanager is selected, [AngularJS](https://www.angularjs.org) is used to get
information from the MQWeb daemon. AngularJS is also used to turn the JSON data
into HTML.
