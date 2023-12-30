# afterwind

A utility library for writing composable Tailwind CSS. It elevates Tailwind CSS from primitive strings to something you can compose, override, extract, nest, conditionally apply, etc, without needing to resort to messy and unpleasant string manipulation.

## Installation

Install with npm

```bash
  npm i afterwind # or yarn add afterwind or pnpm pnpm add afterwind
```

## API Reference

#### .add(string, precedence?)

Adds the classes in the input string to the classes in the wind object while overriding classes that conflict.

#### .remove(string)

Filters out classes from the wind instance that are subtypes of the classes in the input string.

#### .toString()

Returns a string of Tailwind CSS classes.

## Roadmap

- Add CSS conflict detection
- Add support for nesting classes
- Enable specifying modifiers for a group of classes

## Documentation

[Documentation](https://afterwind.js.org)
