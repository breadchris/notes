
### LunaSec Blog Post Workflow

#### Goals
- Release at least one blog post every week
- Every team member contributes posts
- 1/5 of time during a week is spent writing
- Consistent voice 

#### Writing style
- Use positive language
	- Rephrase "this is bad" to "there is room for improvement"
- Use the same tense throughout

##### References
- https://copyblogger.com/blogging-writing-guide/

### Process
#### Ideas
- When there is an idea for a blog post, it should be captured [here](https://github.com/orgs/lunasec-io/projects/6/views/1)on the blog post idea bored

#### Writing
- Move the [blog post idea](https://github.com/orgs/lunasec-io/projects/6/views/1)being worked on from `Ideas` to `In Progress`
- Go to the [docs/blog](https://github.com/lunasec-io/lunasec/tree/master/docs/blog) folder in the repo and create a new markdown file with a name: `yyyy-mm-dd-name.md` and contents:

```markdown
---
title: 
description: 
slug: 
date: 
keywords: []
tags: []
authors: []
---

<!--
  ~ Copyright by LunaSec (owned by Refinery Labs, Inc)
  ~
  ~ Licensed under the Creative Commons Attribution-ShareAlike 4.0 International
  ~ (the "License"); you may not use this file except in compliance with the
  ~ License. You may obtain a copy of the License at
  ~
  ~ https://creativecommons.org/licenses/by-sa/4.0/legalcode
  ~
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  ~
-->

## title

short text

<!--truncate-->

main content
```
- Write blog post content and then create a PR to have blog post reviewed
- A reviewer should complete the review within one day of review being requested
	- Ideally, a synchronous call with a reviewer should be done to make sure the review is completed and feedback is factored into blog post
- Once completed, the PR will be landed to `master`
- Move the [blog post idea](https://github.com/orgs/lunasec-io/projects/6/views/1)being worked on from  `In Progress` to `Done`

#### Publishing
- Publishing to the blog is done automatically with a [github workflow](https://github.com/lunasec-io/lunasec/blob/master/.github/workflows/documentation-release.yaml)