---
layout: default
title: MQWeb use case
excerpt: KBC is using MQWeb to help their developers
---

[KBC](http://www.kbc.be), my employer, is now using my open source project 
[MQWeb](http://www.mqweb.org) to help their developers, who use WebSphere MQ, 
to get status information from their queues and channels.
 
An internal website is created with [CakePHP](http://www.cakephp.org) to get an overview of all available
queuemanagers. Once a queuemanager is selected, [AngularJS](http://www.angularjs.org) is used to get
information from the MQWeb daemon. AngularJS is also used to turn the JSON data
into HTML.
