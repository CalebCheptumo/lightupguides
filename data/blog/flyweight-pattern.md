---
title: 'Flyweight pattern in Java'
date: '2021-06-16'
tags: ['java', 'design-pattern']
draft: false
summary: 'Reduce redundant objects with Flyweight Design pattern'
---

Object creation is the most fundamental operation in OOP. It would be hard to count the number of objects we create(knowingly or behind the scene) even in the most trivial of use cases.

Each object is created on the heap and will take up some space until it is garbage collected. Long running programs will keep the heap occupied. Similarly, concurrently running threads will multiply the memory in use.

Let's look at a simple example:
I have an application which returns me a large number of data points to plot on a graph. The data point contains two informations - the data and how the point looks on the graph

```java
private static class DataPoint {
        private final double data;
        private final Point point;

        public DataPoint(double data, Point point) {
            this.data = data;
            this.point = point;
        }
    }
```

Each Point in turn has a shape and a color:

```java
class Point {
    private String color;
    private String shape;

    public Point(String color, String shape) {
        this.color = color;
        this.shape = shape;
    }
}
```

So lets create a consumer which will create some data points for me.

```java
        DataPoint[] dp = new DataPoint[N];
        for(int i=0; i<N; i++) {
            double data = Math.random(); // or whatever data source
            Point point = data > 0.5 ? new Point("Green", "Circle") : new Point("Red", "Cross");
            dp[i] = new DataPoint(data, point);
        }

```

Looks simple and works fine. Let's look at the amount of memory we used while creating this DataPoint array.

1. DataPoint object -> 2 references + Padding => ~24 bytes.
2. In turn, each DataPoint object has a Point object which takes up memory of its own -> 2 references + the string pool literals(negligible) + Padding => ~24 bytes

So the total memory used by our array becomes (24+24)*N = 48*N bytes. Not much? - Well, depends on N and depends on the number of concurrent threads. For N = 1000 this means 48 KBs. Add 100 threads to it => 4.8 MBs.

### The problem

There are practically only two variations of points - _Green circle_ and _Red cross_ but we created N Point objects.

### The solution - Flyweights

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xuxj3o42ia2uir4dncky.png)

The principle is simple - avoid redundant values in objects. To define our solution, lets define two terms:

1. _Repeating properties_ - The properties that are likely to remain the same for many instances of the object.
2. _Unique properties_ - Properties that change with every instance of the object.

In our scenario each half of the data point objects contain the same value for Point (Probabilistically).

The flyweight design pattern suggests that parts of the object which are likely to repeat among large number of objects should be shared/reused among them rather than being repeated. Some important use cases when we should consider using flyweights:

1. The repeating properties are heavy - The Point object is heavy in this case.
2. There are a limited number of values that the repeating properties can take. - One example is the Boolean class. It can take only two values true or false.

There are many ways to implement this. Let's look at a few ways to implement the Flyweight pattern.

### Method 1 - static factories

We expose a static factory method for each of the two possible instances of Point object.

```java
class Point {
    private String color;
    private String shape;
    private static Point GREEN_CIRCLE = new Point("Green", "Circle");
    private static Point RED_CROSS = new Point("Red", "Cross");

    private Point(String color, String shape) {
        this.color = color;
        this.shape = shape;
    }

    public static Point getGreenCircle() {
        return GREEN_CIRCLE;
    }
    public static Point getRedCross() {
        return RED_CROSS;
    }
}
```

Features:

1. Named methods which describe the type of object being returned.
2. Private static instances - immutable and only one copy.
3. Private constructor - to disallow object creation from outside.

### Method 2 - Enums

```java
enum Point {
    GREEN_CIRCLE("Green", "Circle"),
    RED_CROSS("Red", "Cross");

    private final String color;
    private final String shape;

    Point(String color, String shape) {
        this.color = color;
        this.shape = shape;
    }
}
```

Features:

1. Constructor is implicitly private.
2. An enum conveys the purpose clearly that only a few variations are possible.
3. Immutable data.

Both static factories and enums will create only 2 copies of Point object no matter how many times they are required.

### Method 3 - Caching

The above two examples work well when all variations are already known. Another scenario can be when one of the fields can take more values than anticipated. However, the other values of the object do not change unless that varying field changes.

Let's take a different example in this case. We are creating a Product object. You know that for one product id only one value of a Product object is possible. Creating the Product object again is heavy as you need to set a lot of properties. It is better to keep a copy of the product cached so that object creation is not required twice for a single product. Let's look at the code for it.

```java
class ProductCache {
    public static Map<String, Product> productMap = new HashMap<>();

    public Product getProduct(String productId) {
        Product product;
        if(productMap.containsKey(productId)) {
            product = productMap.get(productId);
        } else {
            product = new Product(/*properties*/);
            productMap.put(productId, product);
        }
        return product;
    }
}
```

Once we create a Product object, we keep it cached into the map against its product id so that we never initialize same the product again.

Hope you enjoyed this introduction to Flyweight pattern and find ways to implement it in your applications.
Thanks for reading.
