---
title: 'Template Method Pattern'
date: '2022-02-22'
tags: ['java', 'design-pattern', 'architecture']
draft: false
summary: 'Implementing the Template Method Pattern in Java'
image: '/static/images/article-images/template-method.jpg'
isTop: true
---

![Template Method Pattern banner](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x2ma02rwkv77v4kz8uf8.png)

Template method pattern is a design pattern that allows you to define a skeleton of an algorithm in an operation, deferring some steps to subclasses.

In simpler terms, this is like making a to-do list that multiple implementations follow in their way.

Let's start with some terminology:

1. **Template Method** - A template method is a method that defines the skeleton of an algorithm in an operation.
2. **Concrete Template** - A concrete template is a class that implements the template method.
3. **Client** - A client is a class that tells the template method which concrete template to use.
4. **Abstract Steps** - An abstract step is a method that is defined in the template method but is left to be implemented by the subclasses.

## A real world example

Let's think about an example of this in the real world. We will compare this to a digital payment system.

- The payment system has a payment gateway which is a template method.
- The customer can use the payment gateway to make a payment.
- The payment gateway has a few steps that are defined in the template method - validating the payment, transferring the money and updating the database.
- However, the implementation of these steps is decided by the exact payment option that the customer chooses - Credit Card, Net Banking, PayPal, etc.

## Let's code this up

### The Template Method

Let's create an abstract class called PaymentGateway:

```java
public abstract class PaymentGateway {
    public final void makePayment() {
        validatePayment();
        transferMoney();
        updateDatabase();
    }
    protected abstract void validatePayment();
   protected abstract void transferMoney();
   protected abstract void updateDatabase();
}
```

Here we have a template method `makePayment()` which calls the three steps of the payment process. None of the steps are implemented in the abstract class.
This method defines a template that its subclasses must follow to make a payment.

We could also have provided a default implementation of the steps in the abstract class for reusability but this is an implementation decision.

To make it even more strict, we have made the template method `final` so that it cannot be overridden. It is a good practice to make the template method final, but it is not a requirement.

### The Concrete Templates

Let's create concrete templates for the payment gateway. We will create two concrete templates:

1. CreditCardPaymentGateway - This template will implement the steps of the payment process for credit card payments.
2. PayPalPaymentGateway - This template will implement the steps of the payment process for PayPal payments.

```java
public class CreditCardPaymentGateway extends PaymentGateway {
    public void validatePayment() {
        // check if the credit card is valid
        // check if the credit card has sufficient balance
        // check if the credit card is expired
    }
    public void transferMoney() {
        // transfer the money from the credit card to the bank account
    }
    public void updateDatabase() {
        // update the database with the transaction details
    }
}
```

```java
public class PayPalPaymentGateway extends PaymentGateway {
    public void validatePayment() {
        // check if the PayPal account is valid
        // check if the PayPal account has sufficient balance
    }
    public void transferMoney() {
        // transfer the money from the PayPal account to the bank account
    }
    public void updateDatabase() {
        // update the database with the transaction details
    }
}
```

### The Client

To choose the payment gateway, we could use a factory. In our case, the factory will return the appropriate payment gateway based on the customer's payment option.

```java
public class PaymentGatewayFactory {
    public PaymentGateway getPaymentGateway(String paymentOption) {
        if (paymentOption.equals("credit card")) {
            return new CreditCardPaymentGateway();
        } else if (paymentOption.equals("paypal")) {
            return new PayPalPaymentGateway();
        } else {
            throw new IllegalArgumentException("Invalid payment option");
        }
    }
}
```

The client will use the factory to get the appropriate payment gateway and make the payment.

```java
public class PaymentGatewayClient {
    public static void main(String[] args) {
        PaymentGatewayFactory factory = new PaymentGatewayFactory();
        PaymentGateway gateway = factory.getPaymentGateway("credit card");
        gateway.makePayment();
    }
}
```

When the `makePayment` method is called on the payment gateway, the template method defined in the abstract class is called.
However, the concrete methods of CreditCardPaymentGateway are called to execute the internal steps.

## Advantages of the Template Method

1. It provides a flexible way to change the implementation of internal steps without missing any of the steps.
2. It provides a flexible way to add more implementations in the future.

Template method pattern is used in Java for many out-of-the-box implementations. For example, InputStreamReader is a template method pattern implementation.

---

Thanks for reading! This should help you understand the concept of the template method pattern. Stay tuned for more design patterns.
If you want to connect with me, you can find me on Twitter [@abh1navv](https://twitter.com/abh1navv)
