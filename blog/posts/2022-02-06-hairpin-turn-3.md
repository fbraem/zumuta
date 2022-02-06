---
layout: blog
date: 2022-02-06
title: Hairpin-turn 3
tags: [hairpin-turn, php, symfony, attributes]
---

Using the symfony routing package with attributes in your own code

---

> In a hairpin-turn article I write about things I learn along the way of heading
> to the top of IT...

# Symfony Routing with Attributes (standalone)

### Attributes
As of PHP 8, [PHP Attributes](https://www.php.net/manual/en/language.attributes.overview.php) 
are available. Attributes can be used to add metadata to classes, methods, 
functions, parameters, properties and class constants. The advantage of using 
attributes, is that you can keep the metadata close to the code.

### Symfony routing
As of version 6, the [Symfony routing](https://symfony.com/doc/current/routing.html) 
package supports Attributes. If there is one place where metadata is interesting
to use, it is routing. In previous versions of PHP, this could be solved using
comments (annotations). With attributes, the dependency on doctrine/annotations
is not needed anymore.

I'm using Symfony router in my own framework and I also wanted to take advantage
of using attributes. Each route is linked to an action class. Attributes applied
to the action class will define how it can be reached. Because I don't use the
Symfony framework, I needed to figure out a way to load the routes from the action
classes.

````php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route(
    path: '/trainings/{id}',
    name: 'trainings.get',
    requirements: [
        'id' => '\d+'
    ]
)]
final class GetTrainingAction
{
    public function __invoke(Request $request, Response $response, array $args): Response
    {
    }
}
````

Symfony routing provides several ways of loading routes. There are Loaders and 
the one we particularly need is the `AnnotationClassLoader`. It's an 
abstract class, so we need to create a new class that derives from it. We need to
define an implementation for the `configureRoute` method.

````php
class RouteClassLoader extends AnnotationClassLoader
{
    protected function configureRoute(
        Route $route,
        \ReflectionClass $class,
        \ReflectionMethod $method,
        object $annot
    ) {
        $route->setDefault('_action', $class);
    }
};
````
The `configureRoute` can be used to add some configuration to the route. In our
case we set _action to the class that is currently loaded. This class is
a reflection to our action class `GetTrainingAction`. In my framework, the action
class always implements an `__invoke` method, so we can ignore `$method` here.

Now we can load the action class into our route collection:

````php
    $loader = new RouteClassLoader();
    $collection = new RouteCollection();
    $collection->addCollection($loader->load(GetTrainingAction::class));
````

In the Route middleware (PSR-15), we try to match the route. When a match is
found the Reflection class will be added as attribute to the request.

````php
    public function __construct(
        private RouteCollection $routes
    ) {
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $symfonyRequest = (new HttpFoundationFactory())->createRequest($request);
        $context = new RequestContext();
        $context->fromRequest($symfonyRequest);

        $matcher = new UrlMatcher($this->routes, $context);
        try {
            $parameters = $matcher->matchRequest($symfonyRequest);
            $route = $parameters['_route'] ?? null;
            unset($parameters['_route']);
            $handler = $parameters['_action'] ?? null;
            unset($parameters['_action']);
            $request = $request
                ->withAttribute('kwai.route', $route)
                ->withAttribute('kwai.action', $handler)
                ->withAttribute('kwai.action.args', $parameters)
            ;
        } catch (\Exception $e) {
            throw new RouteException(message: 'Could not find a route', previous: $e);
        }
    }
````

The actual execution of the action is done in the RequestHandlerMiddleware

````php
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $action = $request->getAttribute('kwai.action');

        if ($action instanceof \ReflectionClass) {
            try {
                $callableAction = $action->newInstance();
            } catch (ReflectionException $e) {
                throw new RuntimeException(
                    message: "Could not create an instance of the action class: $action",
                    previous: $e
                );
            }
        } else {
            throw new \RuntimeException('Invalid request handler set');
        }
        return $callableAction($request, $this->response, $request->getAttribute('kwai.action.args'));
    }
````

### Read more about attributes
[Attributes in PHP 8](https://stitcher.io/blog/attributes-in-php-8) - Stitcher  
[PHP 8.0 A Attributes](https://php.watch/versions/8.0/attributes) - PHP.Watch
