---
title: "security affects everything"
date: "2024-03-24"
author: breadchris
tags:
  - ai
  - blog
  - security
---

As a security engineer, I found this talk interesting. It pushes for something that I agree with: the focus of ML security in research papers is primarily on novel adversarial attacks, but there are actually more pressing concerns around supply chain security.

## Key Concerns

### ML Pipeline Vulnerabilities

Trained models distributed as pickled Python classes can execute code when loaded in another process. This creates significant security risks.

### Dependency Threats

PyPI registry malware and targeted attacks on packages like PyTorch represent critical vulnerabilities. ML pipelines spanning multiple languages inherit vulnerabilities across ecosystems—Log4Shell being a prime example.

### Model Control Risks

Controlling an AI's reasoning represents a powerful capability for attackers. With improving reverse-engineering abilities, identifying exploitable "code paths" becomes a security concern.

## Core Argument

Models function as reprogrammable systems. Comprehensive security oversight is essential since a model's reliability is only as reliable as the data and training that builds it.
