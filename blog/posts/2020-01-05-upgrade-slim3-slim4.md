---
layout: blog
date: 2020-01-05
title: Upgrade Slim framework from 3 to 4
excerpt: 
---
What I needed to do, to upgrade Kwai API to Slim 4 ...
---
# Kwai

[Kwai-api](https://github.com/fbraem/kwai-api) is an API for managing a
sportsclub website. Instead of using a CMS like [Drupal](https://www.drupal.org),
I've decided to write this by composing Kwai-api with libraries and
frameworks because in the past I struggled with upgrading CMS systems from one
major version to another.

One of the frameworks used is [Slim](http://www.slimframework.com/). Slim describes
itself as : *"Slim is a PHP micro framework that helps you quickly write simple yet powerful web applications and APIs."*. On August 2019, a new major version of Slim was
released: 4.0.0.

# Upgrading

Slim 4 has some breaking changes. All of them are listed on the
[Upgrade guide](http://www.slimframework.com/docs/v4/start/upgrade.html).

### Container

Slim 4 has no built-in `Container` class anymore. A separate Container library
which implements the [PSR-11 - Container interface](https://www.php-fig.org/psr/psr-11/)
 is needed now. No problem, that's the way I like to work: select a library
that meets the requirements and use it. I already use some libraries from the
[The PHP League](https://thephpleague.com/), so I selected the [Container](https://container.thephpleague.com/) package. Instead of using the constructor of `App`,
`AppFactory` is used to create the Slim Application instance.

```php
    $container = new Container();
    $container->defaultToShared();
    AppFactory::setContainer($container);

    $application = AppFactory::create();
```

Callbacks are used to create objects that are stored in the container. The current
Container instance was always passed to this function. With the PHP League
implementation this must be set explicitly by calling `addArgument`:


```php
    $container->add('template', function ($c) {
        $dir = $c->get('settings')['template_dir']
        return new TemplateEngine($dir);
    })->addArgument($container);
```

`AppFactory` is introduced to decouple the [PSR-7](https://www.php-fig.org/psr/psr-7/) implementation. I installed [Slim PSR-7](https://github.com/slimphp/Slim-Psr7).

> Kwai API uses an invokable class to execute actions. Slim passes the Container
> instance in the constructor. The container interface must be changed from
> `Interop\Container\ContainerInterface` to `Psr\Container\ContainerInterface`.

### Changes to Routing components

To avoid a big PHP file with a lot of routing information, the first part of the
Kwai api points to a PHP file. In this PHP file a routing group is created. In Slim 3
the `Application` instance was passed to the group function and the `$this`
variable was bound to the Application instance. In Slim 4 this is
changed to an instance of `RouteCollectorProxy` and `$this` is now bound to the
Container instance. This is logical, because this is the same behaviour as
 the routing closure.

So this code :

```php
    $app = \Core\Clubman::getApplication();
    $app->group('/news', function () {
        $this->get('/stories', \REST\News\Actions\BrowseStoryAction::class)
            ->setName('news.browse')
        ;
        ...
    });
```

is changed to:

```php
    use Slim\Routing\RouteCollectorProxy;

    $app = \Core\Clubman::getApplication();

    $app->group('/news', function (RouteCollectorProxy $group) {
        $group->get('/stories', \REST\News\Actions\BrowseStoryAction::class)
            ->setName('news.browse')
        ;
        ...
    });
```

I also had to set a basepath after creating the Application instance.

    $application->setBasePath($basePath);

This wasn't necessary in Slim 3. Because there are also other directories
containing API's, I changed the getApplication method and passes the basepath
as argument. `'/api'` is the default. For judo specific api's, `'/api/sport/judo'`
is passed.

### Changes to Middleware

Our middleware was still using the original interface:

```php
    function (
        ServerRequestInterface $request,
        ResponseInterface $response,
        callable $next
    ) : ResponseInterface
```

but the final standard has changed to:

```php
    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Psr\Http\Server\RequestHandlerInterface;

    interface MiddlewareInterface
    {
        public function process(
            ServerRequestInterface $request,
            RequestHandlerInterface $handler
        ) : ResponseInterface;
    }
```

So each middleware must now implement `MiddlewareInterface`.
