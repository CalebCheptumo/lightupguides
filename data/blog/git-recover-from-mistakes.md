---
title: 'Recover from mistakes with Git'
date: '2021-06-20'
tags: ['git', 'productivity']
draft: false
summary: 'Fixing basic mistakes with Git and code fearlessly'
---

One of the prime advantages of a version control system is to be able to code fearlessly and be able to recover from mistakes.

![Good Git](https://media.giphy.com/media/10CopumcRWLMYM/giphy.gif)

However, this is not Git 101. More often than not, developers find themselves stuck when they make a bad commit or merge. Let's look at a few useful tricks to recover easily from some common problems.

**Note**: I will not use advanced examples and focus on steps which will be easy to understand for developers of all levels.

Let's warm up with an easy one:

### Changing the last commit message

You made typos in last commit message or you want to improve commit message to make it more descriptive. One common(and wrong) practice is to use a temporary commit message like "Initial commit" and when you are done with the actual development piece, you do not want your commit history to look bad.

```bash
git commit --amend
```

By default --amend applies all your staged changes to the previous commits and opens an editor where you can edit the commit message.
![Editing commit](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/indrntuhx7d05u884wyp.JPG)
Change your message -> Save and close the file -> changes are captured by git and commit amendment is executed. You will see an output as below which shows the new state of your commit.

```bash
[main 1a7b82d] Adding jsons
 Date: Sat Jun 19 11:16:19 2021 +0530
 3 files changed, 242 insertions(+)
 create mode 100644 package-lock.json
 create mode 100644 package.json
 create mode 100644 resume.json
```

**Better way** - Change message using the command line itself and not using the editor

```bash
git commit --amend -m "Adding jsons"
```

### Adding files to last commit

You forgot to commit a file. Normally another commit can solve the issue. However, its better to commit those files together. If somebody looks at a commit, they should understand the purpose achieved by it and should not have to look for a subsequent commit for things to make sense. Let's fix this:

- Stage the missed file

```bash
git add .gitignore
```

- Ask git to make staged changes to the last commit.
  Again, the --amend directive is used

```bash
git commit --amend
```

Will again open the editor but now you will also see the new file added to your commit.
![Editor with new file](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v10tnzp64c25toe16zcf.JPG)

Alternatively, If you do not want to change the message, you should use `--amend --no-edit`. It will not open an editor as it does not expect the commit message to change. It will instantly apply changes and output the last commit.

```bash
git commit --amend --no-edit
[main 65f3784] Adding jsons
 Date: Sat Jun 19 11:16:19 2021 +0530
 5 files changed, 246 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 package-lock.json
 create mode 100644 package.json
 create mode 100644 resume.json
 create mode 100644 test.txt
```

### Shift-Deleted a file

You deleted a file from your device which was part of your repo. In this case, git can recover lost files from history.
Suppose I delete the file test.txt. All I need to do is..

```bash
git checkout -- test.txt
```

This will bring back the last committed version of test.txt from your repo.

**Important**: Only last committed version of the file is returned - any local changes you made before deletion are lost and any un-versioned files are not recovered.

Now the syntax is a bit weird as -- is used without an option. But this is just a workaround so that git can distinguish between branch names and files names (for branches, you would use `git checkout branch-name`).

**Note**: There are other scenarios where we can recover files using `revert` and `reset` commands but I will cover them separately. I don't consider those to be basic scenarios.

### Committed in a wrong branch

![MIB Neuralyzer](https://media.giphy.com/media/374pcIBVEGb6g/giphy.gif)
It's very common in a fast paced development environment to forget switching to a new branch. If you commit your changes in a wrong branch, it is pretty easy to resolve this:

- Create the new branch from your current state.

```bash
git branch new-correct-branch
```

This creates a new branch which will already have the commit in it.

- Reset the wrong-branch to the previous correct commit.

```bash
git reset --hard HEAD~
```

This does two things:

1. Moves the HEAD of your branch to the latest-1 commit.
2. Cleans your current wrong-branch of all changes done after latest-1 commit.

**Note**: Be careful not to lose any local changes when using `--hard`. If there are more changes after the wrong commit, make sure you stash them first.

- Switch to the new-correct-branch

```bash
git checkout new-correct-branch
```

The new branch already has the required commit. You can continue your development into it and push changes.

### Removing a pushed commit

Suppose you delivered a small piece of code but it failed in QA testing or introduced a regression. Now you were asked to urgently remove your code from the release branch so as to not affect the release.
![Regret](http://i2.wp.com/awanderingreader.com/wp-content/uploads/2016/09/regret-everything.gif)

Let's see how you can work on it:

- Switch to the branch where the correction is required
- Find the commit to revert. Use `git log` or a UI like Github Desktop or browser. Find the commit id. For e.g. `git log` returns us the below commits:

```
A -> B -> C -> D -> E
```

Let's say C is the target commit. Save the hash of C. Lets say 1df455v631fca.

- Revert the commit

```bash
git revert 1df455v631fca -m "Reverting commit"
```

This removes the changes done by C from the current branch.

**Important** - This does not remove your commit from history. It only adds another commit that reverts the changes. To visualize this, new history would look like:

```
A -> B -> C -> D -> E -> -C
```

---

Hope these steps are helpful in improving your daily git usage. I will get back with some deeper topics on Git. If you want to understand some more use cases of these commands, do check out [this Atlassian tutorial](https://www.atlassian.com/git/tutorials/undoing-changes)

You can find more about me at &nbsp;
[LinkedIn](https://www.linkedin.com/in/abh1navv)
[Twitter/@abh1navv]
(https://www.twitter.com/abh1navv)
