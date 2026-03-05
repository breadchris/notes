---
title: "failing miserably to scale kubes"
date: "2024-03-14"
author: breadchris
tags:
  - blog
  - deploy
  - kubernetes
---

I run a cyber security competition for high schoolers every year. Yesterday was the 7th iteration. Months of planning go into designing the story and putting together digital evidence for the competition.

When 350 students accessed the site simultaneously after the opening presentation, the application became overwhelmed.

## What Went Wrong

The initial response involved attempting to increase pod resources in Kubernetes, but the cluster had insufficient capacity on its budget nodes. Rather than scaling horizontally by adding more pods, I created a new node pool with larger machines.

This approach introduced complications. When attempting to remove the original nodes, a mistake occurred: instead of properly draining the pool, deletion was attempted. A PostgreSQL persistent volume claim blocked node removal, highlighting challenges with running databases in Kubernetes environments.

## The Improvised Solution

The escalating pressure led to improvised solutions:
- Deploying to a Compute Engine VM
- Tunneling through ngrok for HTTPS access (since the network blocked certain TLDs)
- Creating a fragile workaround that barely functioned

## Lessons Learned

Despite the technical failure, there was value in transparently discussing the incident with students, demonstrating how to handle setbacks professionally. The competition eventually ran successfully after addressing the scaling issues.
