---
layout: blog
date: 2022-03-18
title: Hairpin-turn 4
tags: [hairpin-turn, php]
---

Configure your application using PHP dotenv

---

> In a hairpin-turn article I write about things I learn along the way of heading
> to the top of IT...

# PHP dotenv

[PHP dotenv](https://github.com/vlucas/phpdotenv) loads environment variables 
from .env to `getenv()`, `$_ENV` and `$_SERVER` automagically.

Avoid storing sensitive data in your code. Instead, use the environment or a
configuration file. [Storing config in the environment](https://www.12factor.net/config) 
is the third factor of [The Twelve-Factor App](https://www.12factor.net/).

````
composer require vlucas/phpdotenv
````

### Configuration class

Create a wrapper class `Configuration` to hide the dotenv implementation. Add 
 factory methods to create a configuration from a file and from a string.

````php
use Dotenv\Dotenv;
use Dotenv\Loader\Loader;
use Dotenv\Parser\Parser;
use Dotenv\Repository\RepositoryBuilder;
use Dotenv\Store\StringStore;

class Configuration
{
    public function __construct(
        private Dotenv $env
    ) {
    }

    /**
     * Load configuration from a file.
     *
     * @param string $path
     * @param string $file
     * @return static
     */
    public static function createFromFile(string $path, string $file): self
    {
        $env = Dotenv::createImmutable($path, $file);
        $env->load();
        return new self($env);
    }

    /**
     * Load configuration from a string.
     *
     * @param string $content
     * @return static
     */
    public static function createFromString(string $content): self
    {
        $repository = RepositoryBuilder::createWithDefaultAdapters()->immutable()->make();
        $env = new Dotenv(new StringStore($content), new Parser(), new Loader(), $repository);
        $env->load();
        return new self($env);
    }
````

Dotenv does not provide a direct method to load from a string. There is a parse
method, but that method only returns the loaded variables. When you want to add
validation, you need a Dotenv instance. A `StringStore` is available and 
`createFromString` hides the complexity to create and load a Dotenv from a 
string. Probably `createFromString` will not be used in production code, but it
can be useful in unit tests.

After calling `load`, all variables will be available in `$_SERVER`, `$_ENV` or
`getenv()`. Using these variables all over the place in the code is not a good 
idea. What happens when a name of a variable needs to change? The content of 
these variables are not typesafe. Make untyped content as soon as possible typed. 
IDE's and static code analyzers will make it possible to find errors before the 
code is released to production. And as an extra, refactoring code will be a lot 
easier.

### A sample: DatabaseConfiguration.

First make a contract between the Configuration class and the several
configurations: the `Configurable` interface:

````php
<?php
declare(strict_types=1);

use Dotenv\Dotenv;

/**
 * Interface Configurable
 */
interface Configurable
{
    public static function createFromVariables(array $variables): self;

    public static function validate(Dotenv $env): void;
}
````

A database configuration needs a DSN, a user and a password. This class will
be the only one that uses the DB_DSN, DB_USER and DB_PASSWORD strings.

````php
<?php
declare(strict_types=1);

use Dotenv\Dotenv;

/**
 * Class DatabaseConfiguration
 */
class DatabaseConfiguration implements Configurable
{
    public function __construct(
        private string $dsn,
        private string $user,
        private string $password
    ) {
    }

    public function getDsn(): string
    {
        return $this->dsn;
    }

    public function getUser(): string
    {
        return $this->user;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public static function createFromVariables(array $variables): self
    {
        return new self(
            $variables['DB_DSN'],
            $variables['DB_USER'],
            $variables['DB_PASSWORD']
        );
    }

    public static function validate(Dotenv $env): void
    {
        $env->required([
            'DB_DSN',
            'DB_USER',
            'DB_PASSWORD',
        ]);
    }

    public function createConnection(): PDO
    {
        return new PDO($this->dsn, $this->user, $this->password); 
    }
}
````

The DatabaseConfiguration is created with a factory method in Configuration:

````php
    public function getDatabaseConfiguration(): DatabaseConfiguration
    {
        DatabaseConfiguration::validate($this->env);
        return DatabaseConfiguration::createFromVariables($_SERVER);
    }
````

### Testing

Testing the configuration is possible using the `createFromString` method.

````php
it('can create a DatabaseConfiguration', function () {
    $configuration = Configuration::createFromString("DB_DSN=<your_dsn>\nDB_USER=test\nDB_PASSWORD=test1234");
    $dbConfiguration = $configuration->getDatabaseConfiguration();
    expect($dbConfiguration->getDsn())
        ->toBe('<your_dsn>')
    ;
    expect($dbConfiguration->getUser())
        ->toBe('test')
    ;
    expect($dbConfiguration->getDsn())
        ->toBe('test1234')
    ;
});

it('detect a missing password in DatabaseConfiguration', function () {
    $configuration = Configuration::createFromString("DB_DSN=<your_dsn>\nDB_USER=test");
    $configuration->getDatabaseConfiguration();
})
    ->expectException(ValidationException::class)
;
````
> These tests are written with [PestPHP](https://pestphp.com/).

### Dependency injection container

`getenv` and `putenv` are not thread safe. I've experienced that when running
multiple tests. To be sure that only one instance is created of the 
Configuration class, a dependency injection container can be used.
