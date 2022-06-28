---
title: 'The Ultimate Guide to Backtracking'
date: '2022-05-12'
tags: ['data-structures', 'algorithms', 'dsa']
draft: false
summary: 'Guide to backtracking algorithms through solving problems'
image: '/static/images/article-images/backtracking.jpeg'
isTop: true
---

Backtracking is a technique for solving problems by exploring all possible solutions.

Backtracking problems ask us to find combinations or permutations. These Ps & Cs are then matched against certain conditions or smallest/greatest logic. Here are a couple of examples:

- Given an array of numbers, find all the possible combinations of numbers that add up to a given number.
- Given a collection of distinct integers, return all possible permutations of them.

![backtracking-guide](/static/images/article-images/backtracking.jpeg)

In this article, we will use backtracking to solve these two problems. In doing so, we will go through each step of the process in detail.

We will also look at a few important variations of these problems and how to change our solution to solve them.

In short, we can drill down backtracking to the below steps:

1. Start from a state.
2. If the current state is a solution, add the current state to the result.
3. If not, try each of the possible moves from the current state.
4. Once we have tried all the possible moves, backtrack to the previous state.
5. Repeat the above steps until a solution is found or all possibilities have been exhausted.

## Problem 1: Combinations

Let's solve the below problem:

\_Given a list of distinct positive numbers, find all combinations that add up to a given number.

Input: [1, 2, 3, 4], target = 5
Output: [[2, 3], [1, 4]]\_

Let's use the backtracking technique to solve this problem.

**Disclaimer**: There are many ways to solve this problem. I have chosen a way that will be easy to explain. I have left out any clever tricks to keep the code simple.
The programming examples are in Java but do not use any special data structures.

### Initial State

The initial state is an empty list. We are going to start from this state and try to add numbers to it.

**We will keep track of**:

1. The current state or list of numbers used.
2. The sum of the numbers in the list.

```java
public List<List<Integer>> combinationSum(int[] nums, int target) {
    // will store the final result
    List<List<Integer>> res = new ArrayList<>();

    // keeps track of the current state
    List<Integer> current = new ArrayList<>();

    // call the helper function which does the processing
    // first 0 is the sum of the numbers in the current state
    // second 0 is the index to start from
    backtrack(nums, target, 0, 0, current, res);
    return res;
}
```

### Check if the current state is a solution

We need to check if the current state is a solution.
To do so, we need to check if the sum of the numbers in the current state is equal to the target.

If yes, we will add the current state to the final result.

```java
void backtrack(int[] nums, int target, int sum, int index, List<Integer> current, List<List<Integer>> res) {
    // if the sum of the numbers in the current state is equal to the target,
    // then we have found a solution
    if (target == sum) {
        // copy the content of the current state to a new list and save to result
        res.add(new ArrayList<>(current));
        return;
    } else if(sum > target) {
        // short circuit, if the sum of the numbers in the current state is greater than the target,
        return;
    }

    // to be continued...
}
```

### Try each of the possible moves and backtrack

If the current state is not a solution, we need to try each of the possible moves.

The possible moves are all the numbers in the nums array that comes on or after the index.

We can divide this into 3 steps:

1. Add a number to the current list to get to the next state.
2. Call the backtrack function to check if the next state is a solution. Update the index and sum being sent to the backtrack function.
3. Remove the number from the current list to get back to the previous state. The next iteration will try the next number.

```java
void backtrack(int[] nums, int target, int sum, int index, List<Integer> current, List<List<Integer>> res) {
    // checking for solution - omitted

    for (int i = index; i < nums.length; i++) {
        // add the current number to the current state
        current.add(nums[i]);

        // call the helper function to try the next state - Current sum is updated and index is increased to the next number
        backtrack(nums, target, sum + nums[i], i + 1, current, res);

        // remove the current number from the current state
        current.remove(current.size() - 1);
    }
}
```

### Variation 1: Numbers are not distinct

If we ran the same solution, but with the numbers not being distinct, we would get duplicate results.
For e.g. [1, 2, 2, 3, 4] will return [[1, 2, 2], [1,4], [2, 3], [2, 3]]

#### Solution 1: Set to Store Result

The simplest way to solve this problem is to use a Set to keep track of the final result and convert the set to a list at the end.
Although this will lead to a correct solution, this does lead to some unnecessary work being done. Duplicate results are still being calculated even if not included in the result.

```java
public List<List<Integer>> combinationSum(int[] nums, int target) {
    // will store the temporary result
    Set<List<Integer>> res = new HashSet<>();

    List<Integer> current = new ArrayList<>();
    backtrack(nums, target, 0, 0, current, res);

    // convert the set to a list
    return new ArrayList<>(res);
}
```

#### Solution 2: Avoid Duplicate Moves

A better way is to exclude duplicate moves while forming the next state.

Suppose our current state is [1]
When we loop through the remaining numbers, we can get the below possible states:
[1, 2], [1, 2], [1, 3], [1, 4]

To avoid the duplicate move, all we need to do is to check if a number is being processed twice.

We will put the processed numbers in a Set and if a number is already in the set, we can skip it.

```java
void backtrack(int[] nums, int target, int sum, int index, List<Integer> current, Set<List<Integer>> res) {
    // checking for solution - omitted

    Set<Integer> set = new HashSet<>();
    for (int i = index; i < nums.length; i++) {
        // if the current number is already in the set, skip it
        if (set.contains(nums[i])) {
            continue;
        }

        //processing - call and backtrack - omitted

        // add the current number to the set
        set.add(nums[i]);
    }
}
```

We can further remove the set **if the order of the result is not important**.

The steps for this are:

1. Sort the initial array so that all duplicates come together.
2. Instead of using a set, compare numbers to the previous number and skip if it's the same.

The below code can replace the Set logic once the array _nums_ is sorted.

```java
void backtrack(int[] nums, int target, int sum, int index, List<Integer> current, List<List<Integer>> res) {
    // checking for solution - omitted
    for (int i = index; i < nums.length; i++) {
        // if the current number is already in the set, skip it
        if (i > index && nums[i] == nums[i - 1]) {
            continue;
        }
        //processing - call and backtrack - omitted
    }
}
```

### Variation 2: Numbers Can Be Used any Number of Times

If we could use each number any number of times, the result changes.
For e.g. For a target sum of 5, [1,2,3,4] will return [1,1,1,1,1], [1,1,1,2], [1,1,3], [1,2,2], [1,4], [2,3]

This leads to a very small change in our recursive call.
Since the same number can be used again in the solution, we will not increment the index while calling the recursive function.

```java
void backtrack(int[] nums, int target, int sum, int index, List<Integer> current, List<List<Integer>> res) {
    // checking for solution - omitted

    for (int i = index; i < nums.length; i++) {
        current.add(nums[i]);

        // sum is updated but index is not incremented
        backtrack(nums, target, sum + nums[i], i, current, res);

        current.remove(current.size() - 1);
    }
}
```

## Problem 2: Permutations

Let's solve the below problem:

_Given a collection of distinct integers, return all possible permutations of them.
Input: [1, 2, 3]
Output:
[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]_

This becomes simple once our intuition is clear. To form a permutation, there are 2 important principles:

1. **Include all the elements** - This forms the stopping condition.
2. **No element can be included more than once**. This means that at any state, our possible moves include only the elements we have not included before.

We will use a similar approach we used for the combination problem and will incorporate the above two points.

### The Stopping Condition

The stopping condition is that we have included all the elements.

```java
void backtrack(int[] nums,  Set<Integer> current, List<List<Integer>> res) {
    if(current.size() == nums.length) {
        res.add(new ArrayList<>(current));
        return;
    }

    // otherwise process
}
```

### The Possible Moves

The possible moves are the elements that we have not included in the current state before.

We can break this into two steps:

1. Store the numbers that have been used in the current state. In simple words, maintain a Set for the current state.
2. Check for all numbers after each move. We do not need to maintain the index variable as before since we want to check the possibility of all numbers after the current number.

```java
void backtrack(int[] nums,  Set<Integer> current, List<List<Integer>> res) {
    // stopping condition - omitted

    // starting from the first element always
    for(int i = 0; i < nums.length; i++) {

        // if the current number is already in the set, skip it
        if (current.contains(nums[i])) {
            continue;
        }
        current.add(nums[i]);
        backtrack(nums, current, res);
        current.remove(current.size() - 1);
    }
}
```

**Please note that the Set needs to be a LinkedHashSet. This is because we need to maintain the order of the elements.** If it's not, everything falls apart (At least in Java). **If you do not have a Set alternative in your language that provides ordered iteration, simply use a list.** The contains operation does not make a difference to the order of time complexity (discussed later).

### Variation: Numbers Are Not Distinct

If some numbers are not distinct, the above solution cannot find possible permutations.

This is because once a number has been used, its contains check will return true and we cannot use it again.

The current set will never have the length of the original array, and we will be stuck in the backtrack function FOREVER.

#### Solution: Set of Indices

The solution is simple. Instead of maintaining a set of values, we can maintain a set of indices. Indices are always unique.

To maintain a set of indices that have been included in the current state, we can use a boolean array.

The boolean array updates in the same way as the current set/list.

```java
void backtrack(int[] nums,  Set<Integer> current, List<List<Integer>> res, boolean[] used) {
        // stopping condition - omitted

        for(int i = 0; i < nums.length; i++) {
            // if the current number is already in the set, skip it
            if (used[i]) {
                continue;
            }
            // add to boolean array as well as current set
            used[i] = true;
            current.add(nums[i]);

            backtrack(nums, current, res, used);

            // remove from boolean array as well as current set
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }
```

## Time Complexity

The theoretical Time complexity of each of these backtracking algorithms is O(N!) where N is the number of elements in the input array.

This can be calculated by the following intuition:

1. At every step, we have N choices to choose from.
2. After making all choices, we have to make N-1 choices for each of them.
3. And so on.

Number of steps = Nx(N-1)x(N-2)x...x1 = N!

This does not mean all backtracking algorithms are O(N!). It all depends on the number of choices we have at each step.

---

Thanks for reading. The problems and variations in this post cover the most popular variations of the backtracking technique.

If you found this article helpful, please don't forget to share it with people in need - in whatever way possible.

If you want to connect with me, you can find me on [Twitter](https://twitter.com/abh1navv) or [LinkedIn](https://www.linkedin.com/in/abh1navv).
