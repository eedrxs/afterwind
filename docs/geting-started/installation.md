---
sidebar_position: 1
---
# Installation

Below are some of the ways `Afterwind` can be installed;

<!-- - [CDN](./installation.md#using-cdn) - (for development with a simple setup) -->
- [NPM](./installation.md#using-npm) - (use this if you are using bundlers or having a build step)

## Using NPM

[NPM](https://npmjs.org) is a popular javascript package manager on which [Afterwind](https://npmjs.org/afterwind) is a public npm package that can be installed by anyone.

To install it, run one of the following commands:

:::code-group
```sh [npm]
npm install afterwind
```

```sh [pnpm]
pnpm add afterwind
```

```sh [yarn]
yarn add afterwind
```
:::

It provides a production build of the latest release from it's [GitHub repository](https://github.com/henryhale/afterwind/).

**Usage**

Simply import the default `wind` function export and you're good to go.

```js
import wind from 'afterwind';

const style = wind('bg-red text-sm');
```

<!-- ## Using CDN

You can use any CDN that serves npm packages;

Install via CDN using one of the following;

:::code-group
```html [unpkg]
<link rel="stylesheet" href="https://unpkg.com/afterwind/dist/afterwind.css">
<script src="https://unpkg.com/afterwind/dist/afterwind.umd.js"></script>
```

```html [jsdelivr]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/afterwind/dist/afterwind.css">
<script src="https://cdn.jsdelivr.net/npm/afterwind/dist/afterwind.umd.js"></script>
```
:::

Including `Afterwind` javascript file defines a global property `window.Afterwind` on the `window` object. This implies that the `Afterwind` class is globally accessible. 

```js
console.log(Afterwind.version);
//or
console.log(window.Afterwind.version);
``` -->

## Next Step

Now that you have installed `Afterwind`, it is time to dive into the essential parts.