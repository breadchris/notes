---
title: "The Figma Plugin System"
date: "2024-02-21"
author: breadchris
tags:
  - blog
---

Figma is a design tool that has become the industry standard, similar to how Photoshop became the defacto for photo editing. When everyone uses one tool, it only follows that there will be functionality that people want that is not built in. Plugin systems enable community-driven extensions.

Figma published detailed technical documentation on their plugin architecture, including posts on implementation and security considerations worth studying regardless of whether you're building your own plugin system.

## The Security Challenge

Consider a fictional "Catz" plugin that inserts random cat images. A malicious actor could disguise harmful code—potentially compromising files or user accounts.

## Security Evolution

1. **Human Review** - Initial defense, but insufficient against clever obfuscation

2. **Iframe Sandboxing** - Browser's built-in isolation mechanism, though messaging overhead created developer friction

3. **Realm Library** - Attempted to restrict dangerous browser APIs while maintaining performance, but critical vulnerabilities emerged

4. **WebAssembly Solution** - The ultimately chosen approach runs a JavaScript runtime compiled to WASM, giving Figma complete control over what plugin code can access

This progression demonstrates how modern browser capabilities enable sophisticated security models for plugin ecosystems.
