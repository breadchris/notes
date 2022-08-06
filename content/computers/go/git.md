---
title: "computers/go | git"
creation date: 2022-08-05 11:27
---

- no checkout was set to `false`, and that was causing some weird issue where files would not be staged. setting it to `true` fixed this problem

before
```go
func getGitCloneOptions(gitUrl string, snapshotOptions types.SnapshotOptions, progress io.Writer) *git.CloneOptions {
	cloneOptions := git.CloneOptions{
		URL:        gitUrl,
		Progress:   progress,
	}
	// If a branch is specified but no specific commit for checkout is specified, we can go ahead and checkout that branch and only the latest commit
	// if a commit is specified, we are going to go into a detached HEAD on some unknown branch in a later step, so clone everything for now
	if snapshotOptions.GitBranch != "" && snapshotOptions.GitCommit == "" {
		cloneOptions.ReferenceName = plumbing.NewBranchReferenceName(snapshotOptions.GitBranch)
		cloneOptions.SingleBranch = true
		cloneOptions.Depth = 1
	}
	return &cloneOptions
}
```
after
```go
func getGitCloneOptions(gitUrl string, snapshotOptions types.SnapshotOptions, progress io.Writer) *git.CloneOptions {  
 cloneOptions := git.CloneOptions{  
  URL:        gitUrl,  
  Progress:   progress,  
  NoCheckout: true,  
 }  
 // If a branch is specified but no specific commit for checkout is specified, we can go ahead and checkout that branch and only the latest commit  
 // if a commit is specified, we are going to go into a detached HEAD on some unknown branch in a later step, so clone everything for now if snapshotOptions.GitBranch != "" && snapshotOptions.GitCommit == "" {  
  cloneOptions.ReferenceName = plumbing.NewBranchReferenceName(snapshotOptions.GitBranch)  
  cloneOptions.SingleBranch = true  
  cloneOptions.Depth = 1  
  cloneOptions.NoCheckout = false  
 }  
 return &cloneOptions  
}
```