---
title: 'Ways to create Singletons and the tradeoffs between them'
date: '2021-11-23'
tags: ['java', 'architecture', 'design-pattern']
draft: false
summary: 'Ways to create Singletons in Java and how to choose the right approach'
---

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/booj7ek286dwl9js87fz.png)

The singleton pattern is used to ensure that a class has only one instance, and provide a global point of access to it.

### Common use cases

1. **Logging** - A singleton logger is used to log messages to a file.
2. **Database connection** - A singleton database connection is used to connect to a database.
3. **Configuration** - A singleton configuration object is used to store application configuration.
4. **Cache** - A singleton cache is used to store application data.

If you are able to see a pattern here, these are all system-wide concerns.
This makes understanding Singletons very important for any developer.

![There can be only one](https://i.giphy.com/media/5rjEsJnmsUF2CxGg5e/giphy.gif)

## Ways to implement the singleton pattern:

### The simplest way to create a singleton - Private static instance

```java
public class Singleton {
    // data fields
    // ...
    private static final Singleton instance = new Singleton();
    private Singleton() {
    }
    public static Singleton getInstance() {
        return instance;
    }

    // more public methods
   public void doSomething() {
   }
}
```

This means that a static singleton instance is created when the class is loaded.
This is the most common implementation but it is not memory efficient. If the class is not used, the singleton will still be created and if the singleton is heavy, it will consume a lot of memory.

Let's look at some of the important concerns while creating a singleton.

1. **Thread safety** - Since singletons are created to be used by multiple threads, they need to be thread safe. Being thread safe can be viewed in two ways.
   - Ensure that the singleton is not created more than once
   - If the singleton holds data, like in a cache, ensure that the data is thread safe. Methods that update the data should be synchronized.
2. **Efficiency** - We need to ensure optimal memory usage and performance.
   - Memory leaks - If the singleton is heavy and is not used, it will consume a lot of memory.
   - Resource usage - If the singleton consumes system resources, it will consume a lot of CPU cycles. In this case, unless the singleton is used, the system will be underutilized.
3. **Deserialization** - If the singleton is serialized and deserialized, it will be recreated in which case multiple instances will be created. It is not common to serialize singletons however, it is important to understand this.

So let's see if our earlier singleton implementation takes these concerns into account.

1. Thread safe in terms of instance creation - Yes, because static instances are only created once when the class is loaded.
2. Memory usage is not optimal since the singleton is created when the class is loaded and not when it is used.
3. Does not prevent the singleton from being serialized and deserialized.

Now let's see some other ways one by one.

### Private static instance with lazy initialization

```java
public class Singleton {
    private static Singleton instance = null;
    private Singleton() {
    }
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

More memory efficient.
This means that the singleton is not created until the first time it is accessed.

However, this does not take care of the other concerns and loses out on thread safety.

### Private static instance with synchronized getInstance() method

```java
public class Singleton {
    private static Singleton instance = null;
    private Singleton() {
    }
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

Memory efficient + thread safe instantiation.

- This solves the problem of multiple threads trying to create the singleton at the same time. However, this also has a small trade-off. The synchronized method will make the singleton slower because it will block the calling thread if another thread is currently requesting the singleton.

Let's improve on this.

### Private static instance with double-checked locking

```java
public class Singleton {
    private static volatile Singleton instance = null;
    private Singleton() {
    }
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

Memory efficient + thread safe.
This is more efficient because the synchronized block is only entered once and not when an already created instance is accessed.

Another way to implement this is by using the Singleton Holder pattern.

### Singleton Holder Pattern

```java
public class Singleton {
    private static class SingletonHolder {
        private static final Singleton instance = new Singleton();
    }
    private Singleton() {
    }
    public static Singleton getInstance() {
        return SingletonHolder.instance;
    }
}
```

Focus on the SingletonHolder.instance call. When it is first called, the SingletonHolder class is loaded.
The class loader will then create the static singleton instance and return it.
This makes the SingletonHolder class thread safe since it holds a static instance.

A common pitfall of all the above implementations is that they are not immune to serialization or reflection.

There are two ways to prevent this:

### Implementing readResolve()

```java
public class Singleton {
    private static volatile Singleton instance = null;
    private Singleton() {
    }
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
    private Object readResolve() {
        return instance;
    }
}
```

By implementing a `readResolve()` method, the singleton will be deserialized as the same instance which is already created.

### Enum singleton

```java
public enum Singleton {
    INSTANCE;
    public void doSomething() {
    }
}
```

- Enums can only have a certain number of instances/variations. This makes it possible to implement a singleton with an enum with only one possible instance.
- Enums are immune to serialization and reflection. When an enum is deserialized, the instance will be the same as the only possible instance which already exists.
- Enum instantiation is thread-safe by design.

Trade-off - Enums are not memory efficient.

### Which singleton implementation is best for your use case?

1. If memory is not an issue or the singleton instance is light, simply use an enum singleton.
2. If memory is an issue, use a lazy initialization singleton.
   - Further if thread safety is an issue, use a double-checked locking singleton or a holder pattern.
   - Further if you need to prevent the singleton from being serialized, use a double-checked locking singleton with readResolve().

---

Thanks for reading! Hope this provides you different ways to implement a singleton in Java and the trade-offs associated with them.
If you want to connect with me, you can find me on Twitter [@abh1navv](https://twitter.com/abh1navv)
