---
sidebar_position: 4
---
# API Reference

- [wind.add()](#wind-add)
- [wind.remove()](#wind-remove)
- [wind.toString()](#wind-toString)

---

## wind.add() {#wind-add}

Adds classes to a Wind instance.

- **Type**

    ```ts
    interface Wind {
        mount(str: string | Wind): Wind;
    }
    ```

- **Details**

    It takes string of classes or a `Wind` instance and adds it to the instance's classes.

- **Example**

    ```js
    import wind from 'afterwind';

    const style = wind('bg-red text-sm');
    wind.add('font-bold');
    ```

<!-- - **See also:** [Guide - Creating a Terminal](../guide/initialization.md#creating-your-first-terminal) -->


## wind.remove() {#wind-remove}

Removes the list of classes passed to it.

- **Type**

    ```ts
    interface Wind {
        remove(str: string | Wind): Wind;
    }
    ```

- **Details**

    It takes a string of classes or a `Wind` object and removes the classes from the instance.

    <!-- _The terminal should not be used again once disposed._ -->

- **Example**

    Remove all `text` classes

    ```js
    const style = wind('bg-red text-sm md:text-lg');
    style.remove('text');
    ```

    Remove all classes with `md:` modifier

    ```js
    const style = wind('bg-red text-sm md:text-lg hover:md:mb-3');
    style.remove('md:');
    ```

<!-- - **See also:** [Guide - Disposal](../guide/disposal.md) -->

## wind.toString() {#wind-toString}

Convert instance to a string of classes.

- **Type**

    ```ts
    interface Wind {
        toString(): void;
    }
    ```
  
- **Details**
  
  This method takes no argument. It simply returns the instance as a string of classes.

- **Example**

    Getting the string representation of an instance
    
    ```js
    wind.toString();
    ```

