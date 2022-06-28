---
title: 'A Guide to Records in Java'
date: '2022-05-15'
tags: ['java', 'java-14', 'records']
draft: false
summary: 'A complete guide to creating value objects using Java Records with code examples'
images: '/static/images/article-images/java-records.jpg'
---

![Java Record banner image](/static/images/article-images/java-records.jpg)

In this tutorial, we will cover the basics of how to use records in Java.
Records were introduced in Java 14 as a way to remove boilerplate code around the creation of value objects while incorporating the benefits of immutable objects.

<TOCInline toc={props.toc} asDisclosure='true'/>

## 1. Basic Concepts

Before moving on to Records, let's look at the problem Records solve. To understand this, let's examine how value objects were created before Java 14.

### 1.1. Value Objects

Value objects are an integral part of Java applications. They store data that needs to be transferred between layers of the application.

A value object contains fields, constructors and methods to access those fields.
Below is an example of a value object:

```java
public class Contact {
    private final String name;
    private final String email;

    public Contact(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
```

### 1.2. Equality between Value Objects

Additionally, the value objects may provide a way to compare them for equality.

By default, Java compares the equality of objects by comparing their memory address. However, in some cases, objects containing the same data may be considered equal.
To implement this, we can override the `equals` and `hashCode` methods.

Let's implement them for the _Contact_ class:

```java
public class Contact {

    // ...

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Contact contact = (Contact) o;
        return Object.equals(email, contact.email) &&
                Objects.equals(name, contact.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, email);
    }
}
```

### 1.3. Immutability of Value Objects

Value objects should be immutable. This means that we should restrict ways to change the fields of the object.

This is advisable for the below reasons:

- To avoid the risk of accidentally changing the value of a field.
- To make sure equal objects remain equal throughout their lifetime.

The Contact class is already immutable. We have:

1. Made the fields _private_ and _final_.
2. Provided only a _getter_ for each field and no _setters_.

### 1.4. Logging Value Objects

We will often need to log the values that the objects contain. This is done by providing a `toString` method.
Whenever an object is logged or printed, the `toString` method is called.

The easiest way is to print each field's value. Here is an example:

```java
public class Contact {
    // ...
    @Override
    public String toString() {
        return "Contact[" +
                "name='" + name + '\'' +
                ", email=" + email +
                ']';
    }
}
```

## 2. Reducing Boilerplate with Records

Since most value objects have the same needs and functionality, it was a good idea to make the process of creating them easier.
Let's look at how Records achieve this.

### 2.1. Converting Person Class to a Record

Let's create a record of the Contact class which has the same functionality as the Contact class defined above.

```java
public record Contact(String name, String email) {}
```

The 'record' keyword is used to create a record class. Records can be treated exactly like a class by a caller.
For e.g, to create a new instance of the record, we can use the `new` keyword.

```java
Contact contact = new Contact("John Doe", "johnrocks@gmail.com");
```

### 2.2. Default Behaviour

We have reduced the code to a single line. Let's list down what this includes:

1. The _name_ and _email_ fields are private and final by default.
2. It defines a "canonical constructor" which takes the fields as parameters.
3. The fields are accessible via getter-like methods - `name()` and `email()`. There is no setter for the fields so the data in the object becomes immutable.
4. A `toString` method is implemented to print the fields the same as we did for the Contact class.
5. The `equals` and `hashCode` methods are implemented. They include all the fields just like the Contact class.

### 2.3 The Canonical Constructor

The constructor defined by default takes in all fields as input parameters and sets them to the fields.

E.g., below is the canonical constructor defined behind the scenes:

```java
public Contact(String name, String email) {
    this.name = name;
    this.email = email;
}
```

If we define a constructor with the same signature in the record class, it will be used instead of the canonical constructor. More on this in the next section.

## 3. Working with Records

We may want to change the behavior of the record in multiple ways. Let's look at some use cases and how to achieve them.

### 3.1. Overriding default implementations

Any default implementation can be changed by overriding it. E.g. if we want to change the behavior of the `toString` method, we can override it between the braces {}.

```java
public record Contact(String name, String email) {
    @Override
    public String toString() {
        return "Contact[" +
                "name is '" + name + '\'' +
                ", email is" + email +
                ']';
    }
}
```

Similarly, we can override the `equals` and `hashCode` methods as well.

### 3.2. Compact Constructors

Sometimes, we want constructors to do more than just initialize the fields.
We can add these operations to our record in a compact constructor. It's called compact because it does not need to define the initialization of fields or the parameter list.

```java
public record Contact(String name, String email) {
    public Contact {
        if(!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
    }
}
```

**Note that there is no parameter list and initialization of name and email takes place in the background before the validation is performed.**

### 3.3. Adding Constructors

We can add more constructors to our record. Let's see a few examples and a couple of restrictions.

First, let's add new valid constructors:

```java
public record Contact(String name, String email) {
    public Contact(String email) {
        this("John Doe", email);
    }

    // replaces the canonical constructor
    public Contact(String name, String email) {
        this.name = name;
        this.email = email;
    }
}
```

In the first constructor, the canonical constructor is accessed using the _this_ keyword.
The second constructor overrides the canonical constructor because it has the same parameter list. In this case, the record will not create a default canonical constructor on its own.

There are a few restrictions on the constructors.

**1. The canonical constructor should always be called from any other constructor.**
E.g., the below code will not compile:

```java
public record Contact(String name, String email) {
    public Contact(String name) {
        this.name = "John Doe";
        this.email = null;
    }
}
```

This rule ensures that fields are always initialized. It also ensures that the operations defined in the compact constructor are always executed.

**2. Cannot override the canonical constructor if a compact constructor is defined.**
When a compact constructor is defined, a canonical constructor is automatically constructed with the initialization and compact constructor logic.

In this case, the compiler won't allow us to define a constructor with the same arguments as the canonical constructor.

E.g., this won't compile:

```java
public record Contact(String name, String email) {
    public Contact {
        if(!email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
    }
    public Contact(String name, String email) {
        this.name = name;
        this.email = email;
    }
}
```

### 3.4. Implementing Interfaces

Just like any class, we can implement interfaces in our record.

```java
public record Contact(String name, String email) implements Comparable<Contact> {
    @Override
    public int compareTo(Contact o) {
        return name.compareTo(o.name);
    }
}
```

**Important Note:** To ensure complete immutability, records are not allowed to participate in inheritance. **Records are final and cannot be extended. Nor can they extend other classes.**

### 3.5. Adding Methods

In addition to constructors, overriding methods and implementing interfaces, we can also add any methods we want.

For example:

```java
public record Contact(String name, String email) {
    String printName() {
        return "My name is:" + this.name;
    }
}
```

We can also add static methods. For example, if we wanted to have a static method that returns the regex against which emails can be validated, we can define it as below:

```java
public record Contact(String name, String email) {
    static Pattern emailRegex() {
        return Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);
    }
}
```

### 3.6. Adding Fields

We cannot add instance fields to our record. However, we can add static fields.

```java
public record Contact(String name, String email) {
    private static final Pattern EMAIL_REGEX_PATTERN = Pattern
            .compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    static Pattern emailRegex() {
        return EMAIL_REGEX_PATTERN;
    }
}
```

Note that there are no implicit restrictions on the visibility of static fields. They can be public if needed and may not be final.

## Conclusion

Records are a great way to define data classes. They are a lot more powerful than the JavaBeans/POJO approach.
Because of their ease of implementation, they should be preferred over other approaches for creating value objects.

---

Thanks for reading. If you have any questions/suggestions, please feel free to mention them in the comments.

If you want to connect with me, you can find me on [Twitter](https://twitter.com/abh1navv)
