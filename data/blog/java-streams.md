---
title: '12 Common uses of Java Streams'
date: '2022-03-09'
tags: ['java']
draft: false
summary: '12 Common uses of Java Streams with code examples'
image: '/static/images/article-images/java-streams.jpg'
isTop: true
---

Java Streams API was introduced in Java 8. Its aim is to provide a less verbose and concise way to carry out common operations on collections of objects.

Although it can be hard to get used to, the Java Streams API is very powerful and can be used to implement complex algorithms.

<TOCInline toc={props.toc} asDisclosure='true'/>

In this article, we will talk about some common use cases of the Java Streams API.

For those of us not proficient with the Streams API, the goal should be to keep these use cases in mind and whenever we come across one of them, we should try to implement them using Streams rather than the traditional way.

Let's establish some basics first.

- `stream()` - creates a stream from a collection
- `collect()` - collects the stream into an object. The object can be a collection, primitive, or a custom class.
- `Collectors` - a class which provides (a lot of) static methods for collecting streams. We will use some of these below. Refer to the documentation for full reference.

These are the most popular stream operations and will be used in the rest of this tutorial.

## Use cases

Let's look at some use cases of streams:

### 1. Filtering

- Used for removing values from a Collection based on a condition.
- `filter()` method is used to filter the elements of a Collection based on a condition. Only matching elements are retained.

E.g. - Remove all odd numbers from a list.

```java
List<Integer> evenNumbers = originalList.stream()
        .filter(n -> n % 2 == 0)
        .collect(Collectors.toList());
```

### 2. Preprocessing

- Useful when each value in the collection needs to be changed in place.
- `map()` method is used to apply a function to each element of a Collection and return a new Collection of the computed values.

E.g. Convert each value to its square.

```java
List<Integer> squares = originalList.stream()
        .map(n -> n * n)
        .collect(Collectors.toList());

```

### 3. Conversion

- Useful when we want to convert a Collection to another Collection.
- There are multiple ways to achieve this and let's see them.

In general, as mentioned above, we can use map() and collect() methods to convert a Collection to another Collection.

Example 1. Create a Map from a List.

Convert a list of strings to a map of string and length.

```java
Map<String, Integer> wordLengths = words.stream()
        .collect(Collectors.toMap(
                word -> word,
                word -> word.length()));
```

Example 2. Convert list to sets.

This is a common use case for removing duplicates.
Further, if we want to put the elements back to a list, we can use the stream() and collect() methods twice.

Convert a list of strings to a list of unique strings.

```java
// if we want to collect to a set
Set<String> uniqueWords = words.stream()
        .collect(Collectors.toSet());

// OR

// if we want to start and end as a list
List<String> uniqueWords = words.stream()
        .collect(Collectors.toSet()).stream().collect(Collectors.toList());
```

Example 3. Convert a list of Products to a list of their names. (Flattening)

```java
List<String> productNames = products.stream()
        .map(product -> product.getName())
        .collect(Collectors.toList());
```

### 4. Reduction

- Reduce a Collection to a single value.
- `reduce()` method is used to apply a function to each element of a Collection and return a single value.

Note that since the `reduce()` method returns a single value, it is not possible to use it to return a Collection.

E.g. Sum all the values in a list.

```java
int sum = numbers.stream()
        .reduce(0, (a, b) -> a + b);
```

### 5. Grouping

- Group elements of a Collection based on a condition.
- `Collectors.groupingBy()` method is used to group elements of a Collection based on a condition.

E.g. Group all products into lists of Products by their category.

```java
Map<String, List<Product>> productsByCategory = products.stream()
        .collect(Collectors.groupingBy(product -> product.getCategory()));
```

### 6. Finding

- Finding the first or any element of a Collection which matches a condition.
- `findFirst()` and `findAny()` methods are used to find the first or any element of a Collection which matches a condition.

This is typically similar to linear search.

E.g. Find the first word in a list which is longer than 5 characters.

```java
Optional<String> firstLongWord = words.stream()
        .filter(word -> word.length() > 5)
        .findFirst();
// Note that findFirst() and findAny() methods return Optional<T> objects.
```

### 7. Sorting

- Sort elements of a Collection.
- `sorted()` method is used to sort elements of a Collection.

In general, Collections.sort() is enough to sort a Collection. We can use sorted() specially if we want to follow it with another operation.

E.g. Sort a list of numbers in ascending order and then return the first k elements.

```java
List<Integer> topK = numbers.stream()
        .sorted()
        .limit(k)
        .collect(Collectors.toList());
```

### 8. Partitioning

- Partition elements of a Collection based on a condition.
- `Collectors.partitioningBy()` method is used to partition elements of a Collection based on a condition.

Partitioning is similar to grouping except it returns two Collections - one for elements matching the condition and one for elements not matching the condition.

E.g. Partition students into passing and failing.

```java
 Map<Boolean, List<Student>> passingFailing = students
        .stream()
        .collect(Collectors.partitioningBy(s -> s.getGrade() >= PASS_THRESHOLD));
```

### 9. Counting

- Count the number of elements matching a condition.
- `count()` method is used to count the number of elements matching a condition.

E.g. Count the number of words in a list which are longer than 5 characters.

```java
long count = words.stream()
        .filter(word -> word.length() > 5)
        .count();
```

### 10. Range

- Create a range of values.
- `range()` method is used to create a range of values.

There are special classes for creating streams of particular types - `IntStream, LongStream, DoubleStream, and Stream`.

These classes are useful when dealing with primitive numeric types. Internally, they use `Arrays.stream()` to create the stream.

E.g. Create an array of numbers from 0 to 10.

```java
int[] numbers = IntStream.range(0, 10).toArray();
```

### 11. Matching

- Match elements of a Collection against a predicate(condition).
- Methods such as `anyMatch()`, `allMatch()`, and `noneMatch()` are used to match elements of a Collection against a predicate and return a boolean value.

E.g. Check for products with a price greater than 10.

```java
// true when all elements match the predicate
boolean allMatch = products.stream()
        .allMatch(product -> product.getPrice() > 10);

// true when any element matches the predicate
boolean anyMatch = products.stream()
        .anyMatch(product -> product.getPrice() > 10);

// true when no elements match the predicate
boolean noneMatch = products.stream()
        .noneMatch(product -> product.getPrice() > 10);
```

### 12. Joining

- Join elements of a Collection into a String.
- `Collectors.joining()` method is used to join elements of a Collection into a String.

E.g. Join all the words in a list into a single string.

```java
String joinedWords = words.stream()
        .collect(Collectors.joining(" "));
```

Thats it for the common scenarios. There are other less common scenarios you can explore on your own:

1. Parallel Streams
2. Statistics
3. Custom Collectors.

### Advantages of Streams

- **Less Verbose Code** - Reduces the amount of code needed to process a Collection.
- **Lesser intermediate variables** - Intermediate variables can be an opportunity to make mistakes. Having fewer of them can help us avoid unexpected bugs.
- **Intuitive code** - Some developers will disagree that streams are more intuitive than other methods. However, they are much more intuitive than other methods once we get used to them. Reading 5 lines to understand that we are filtering and removing products from a list isn't intuitive compared to reading just a `filter()` method.

---

Thanks for reading. I hope you enjoyed this article.
There are many more cases where streams can be used which are not covered in this thread. Feel free to add any common scenario I missed.

If you want to connect with me, you can find me on [Twitter](https://twitter.com/abh1navv).
