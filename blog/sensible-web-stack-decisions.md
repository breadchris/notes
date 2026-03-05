---
title: "sensible web stack decisions"
date: "2024-03-02"
author: breadchris
tags:
  - blog
  - web
---

I have so much goddamn respect for web developers. A long list of side projects has consumed a significant amount of my time and have been riddled with frustration. What is most frustrating when writing code is having to choose what tool to use.

## Key Technologies

### Tailwind CSS

I initially resisted Tailwind but became convinced after reading Adam Wathan's work on utility-class philosophy. It predates the library and discusses rules for styling sites that make sense. DaisyUI is recommended as a complementary tool providing simpler class naming conventions.

### esbuild

The holy grail of JS build systems. esbuild resolves issues with slower alternatives like Webpack. Its Go-based implementation and straightforward documentation enable fast builds and hot reloading.

### React

Selected as superior for stateful JavaScript applications, primarily due to its extensive library ecosystem and functional programming paradigm. I express skepticism toward Svelte's recent decision to deprioritize TypeScript support.

### htmx

Praised for returning applications to REST principles by serving HTML instead of JSON-only endpoints. The book "Hypermedia Systems" provides transformative perspective on building reactive interfaces without full Single-Page Application complexity.

## Conclusion

This stack was explicitly curated to work for the most significant number of use cases, while acknowledging individual project constraints may warrant different choices.
