---
layout: default
title: MQ Statistics with triggers and MQWeb
excerpt: How we capture MQ statistics using MQ Triggers and MQWeb
---

## What?

IBM MQ can generate statistics for queues, channels, ... To be able to do some
capacity management, these statistics will be transferred to
[ELK](https://www.elastic.co/products) (Elasticsearch, Logstash & Kibana).
This solution will use two Python scripts to get statistics in JSON format from
[MQWeb](http://www.mqweb.org) and saves the statistics to a file. With [filebeat](https://www.elastic.co/products/beats/filebeat) the generated files
are collected and transferred to ELK.

## How?

### Enable IBM MQ Statistics

IBM MQ puts statistic messages on the `SYSTEM.ADMIN.STATISTICS.QUEUE`. This is
done when the queuemanager property `STATQ` has value `ON` or when the queue
property `STATQ` has value `ON`. By default the statistics are generated every
1800 seconds. The interval can be changed by setting the `STATINT` property of
the queuemanager.

It's also possible to force the generation of the statistics by issuing the
following command on a queuemanager:

    RESET QMGR TYPE(STATISTICS)

### Gather statistics from a queue

Statistic messages are messages with format `MQADMIN`. The message payload is
a collection of `PCF` structures. [MQWeb](http://www.mqweb.org) has an API to
get messages from a queue and translate `MQADMIN` messages into a readable JSON
structure. The [`mqstats.py`](https://gist.github.com/fbraem/2cd3557a759659250b5c5dc903b8ba4a#file-mqstats-py) script will use MQWeb to get these messages and output them to stdout or to a file.
The script ends when there are no more messages to process.

### Triggering

The [`mqstats.py`](https://gist.github.com/fbraem/2cd3557a759659250b5c5dc903b8ba4a#file-mqstats-py) script must run when messages are available on the queue. To avoid the creation
of a new daemon process, the IBM MQ triggering system is used. IBM MQ can
trigger the script whenever the queue depth of the queue changes from 0 to 1.
Because IBM MQ passes an `MQTMC2` structure to the triggered process, another
script [`mqstatstrigger.py`](https://gist.github.com/fbraem/2cd3557a759659250b5c5dc903b8ba4a#file-mqstatstrigger-py)
is written. This script will translate the `MQTMC2` structure into commandline arguments for `mqstats.py` and execute it.

> The `mqstats.py` script can be used directly from the commandline. Use
> the --help argument to show help information. When the MQ trigger doesn't fire
> (because there are still messages on the queue), run the `mqstats.py` from the
> commandline to process the remaining messages.

Follow these steps to setup IBM MQ triggering:

#### Initiation queue

When a trigger event occurs, the queuemanager puts a trigger message on a
`initiation queue`. This trigger message will be retrieved by the trigger
monitor.

    DEFINE QL(MQ.STATISTICS.TRIGGER.Q1) +
    DESCR('Initiation Queue For Collecting Statistics')

#### Define a process

The process defines what the trigger monitor must execute when the trigger is fired.

    DEFINE PROCESS(MQ.STATS) +
    APPLICID('python mqstatstrigger.py') +
    USERDATA('output=/var/elk') +
    DESCR('ELK statistics script')

The `USERDATA` value is used by the [`mqstatstrigger.py`](https://gist.github.com/fbraem/2cd3557a759659250b5c5dc903b8ba4a#file-mqstatstrigger-py) script to pass arguments to [`mqstats.py`](https://gist.github.com/fbraem/2cd3557a759659250b5c5dc903b8ba4a#file-mqstats-py)

#### Alter the local queue

The queue that is responsible for the trigger must be associated with the
initiation queue and the process:

    ALTER QL(SYSTEM.ADMIN.STATISTICS.QUEUE) +
    INITQ(MQ.STATISTICS.TRIGGER.Q1)
    PROCESS(MQ.STATS) +
    TRIGTYPE(FIRST)

#### Define a service

The `runmqtrm` program is the IBM MQ trigger monitor. It must run in background. When a service is used, it can be controlled by the queuemanager by setting the `CONTROL` property to `QMGR`. This way the service will automatically start and stops when a queuemanager is started or stopped.

    DEFINE SERVICE(MQ.STATS.TRIGMON) +
    CONTROL(QMGR) +
    STARTCMD('+MQ_INSTALL_PATH+bin/runmqtrm') +
    STARTARG('-m +QMNAME+ -q MQ.STATISTICS.TRIGGER.Q1') +
    STOPCMD('+MQ_INSTALL_PATH+bin/amqsstop') +
    STOPARG('-m +QMNAME+ -p +MQ_SERVER_PID+') +
    STDOUT('/var/elk/mqstats.stdout') +
    STDERR('/var/elk/mqstats.stderr') +
    DESCR('Trigger Monitor for ELK Statistics')
