# Contributing to Cosmos

If you're reading this you have probably already decided you want to make a contribution to Cosmos. 

🎉 **Thank you!!** 🎉

Here's some information to help you along the glorious open source journey.

## Before you start

Before you start making a contrbution it's important to see if your idea is something the developer wants to include.

Cosmos is currently maintained by a single developer in his spare time on a shoe string budget. 
To reduce the number of hours he is kept awake at night only a subset of features will be included. 
This will reduce the amount of maintenance that Cosmos requires and will streamless use. 

### Create a issue

Create an issue in this project and tag it with an appropriate tag (probably `bug` or `feature`).
The developers will then descend from their nests to dissect the idea, discuss implementation and assign the work.

It's at this point you will be told whether or not your issue will be address or your feature included. 

## Git process

The general process to follow to get a contribution included is as follows:

* Fork the project
* Clone your fork
* Make changes
* Add tests
* Commit and push the changes to your fork
* Create a pull request

If you are only interested in updating some wording in one file you can use the [GitHub inline editor](https://docs.github.com/en/github/managing-files-in-a-repository/editing-files-in-another-users-repository) instead.

## What to include

When submitting a pull request please makes sure you have the following:

* [Atomic commits](https://www.freshconsulting.com/atomic-commits/) (with the ticket number)
* Comments (where the code is not self documenting)
* Tests (that pass!)
* Documentation (if required, including the `help` command)

🙏 **Please add the issue number to your commit messages so that they can be tracked!** 🙏
Not doing so will cause you to get a lesson about how you don't need a time machine to [change history](https://thoughtbot.com/blog/git-interactive-rebase-squash-amend-rewriting-history).

There is automated code style formatting on commit through `husky` and `eslint`. 
If you override this your PR will be denied. 
The developer is very opinionated about the [tabs vs spaces debate](https://michael.standen.link/2018/12/13/tab-vs-spaces.html).

The tests are run automatically against a pull request. 
If the pull request fails the tests it will not be merged. 

## I can't code

Great! There are still plenty of opportunities to contribute:

* Ether keeps Cosmos running: `0x455fef5aeCACcd3a43A4BCe2c303392E10f22C63`.
* Feature requests and bug reports help improve Cosmos.
* Spreading the good word grows the community.
* Update the docs (my primary language is JS).

## ❤️ Thank you ❤️

Cosmos is a labour of love and a passion project.
It wouldn't exist without the community around to support it.
Taking the time to stop by let's the developer know that you find value in it too.
