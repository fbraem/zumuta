---
layout: blog
date: 2015-11-21
title: Poco Redis
excerpt: Poco Redis module merged into Poco develop
---
Today the development of the Poco Redis module is merged into the 
[Poco development branch](https://github.com/pocoproject/poco/tree/develop/Redis).
---
Some examples:

###Setting a key/value with add

    Array command;
    command.add("SET").add("mykey").add("Hello");

    // A set responds with a simple OK string
    try
    {
      std::string result = redis.execute<std::string>(command);
    }
    catch(RedisException &e)
    {
      ...
    }

###Setting a key/value with <<

    Array command;
    command << "SET" << "mykey" << "Hello";

    // A set responds with a simple OK string
    try
    {
      std::string result = redis.execute<std::string>(command);
    }
    catch(RedisException &e)
    {
      ...
    }

###Setting a key/value with Command class

    Command set = Command::set("mykey", "Hello");

    // A set responds with a simple OK string
    try
    {
      std::string result = redis.execute<std::string>(set);
    }
    catch(RedisException &e)
    {
      ...
    }

