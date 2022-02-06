---
layout: blog
date: 2022-02-02
title: Hairpin-turn 2
tags: [hairpin-turn, php, refactor]
---

Reducing lines of code with the ?? coalescing operator

---

> In a hairpin-turn article I write about things I learn along the way of heading
> to the top of IT...

# ??

The [null coalescing operator](https://www.php.net/manual/en/language.operators.comparison.php#language.operators.comparison.coalesce)
(??) is available in PHP since version 7. This operator can help to reduce code 
to check for null values or existing values:

This code comes from [kwai-api](https://github.com/fbraem/kwai-api). It checks 
if a user needs to pass a token for the current route:

````php
    $extra = $request->getAttribute('kwai.extra');
    if (isset($extra)) {
        if (isset($extra['auth'])) {
            return $extra['auth'];
        }
    }
    return false;
````

With the ?? operator the code becomes this:

````php
    $extra = $request->getAttribute('kwai.extra') ?? ['auth' => false];
    return $extra['auth'] ?? false;
````

When `kwai.extra` does not exist, we create a default array with `auth` set to 
false. Next, the value of `$extra['auth']` will be returned, unless there is 
no `auth` element, which is possible when `kwai.extra` did exist, false is returned.

::: tip
Do you have a unit test for the code you are about to refactor? No, add it first,
refactor and rerun the test to see if the refactor didn't break any code.
:::

The null coalescing operator is also available in other programming languages. On
Wikipedia, you can find an [overview](https://en.wikipedia.org/wiki/Null_coalescing_operator).
