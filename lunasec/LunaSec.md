-
- ### Meaningfully Managing Vulnerabilities and Malware for Fast Moving Teams
	- LunaTrace: Trace your code to the source
		- background-color:: #533e7d
		  ```mermaid
		  flowchart TD
		      A[Task] --> B[Developer]
		      B --> C{Use a library?}
		      C --> |Yes| D[Import library]
		      D --> E[Pull Request]
		      C --> |No| H[Write code]
		      H --> E
		      E --> F[Source Control]
		      F --> G[Build]
		      G --> I[Artifact Repository]
		      I --> J[Running in Production]
		  ```
		-
	- Every time a developer is working on a task, there is simple choice that they can make: "Do I solve this task with a library, or should I write the code myself?".
	- While a simple choice on the surface, there are a number of things that you should be considering, that maybe aren't so obvious.
		- Before installing that library, are you going to go look at the code?
	- LunaTrace: Automated Security Peer Review, with a personal touch
	- LunaTrace Proactive Resolution
	- LunaTrace Library Insight
		- npms.io score
		- https://www.phylum.io/ risk framework
		- snyk package score
	- Threat Model
		- Beyond Code: Before any code is even written, Lunatrace guides you in creating a threat model of your code. Does this service touch sensitive data? Answering simple questions like these will guide LunaTrace to provide security recommendations where they matter. It helps us stay out of your way while you do the important work.
	- Developer
		- Suggestions: Get an on-demand report of a package before adding. How many people use this package. Is this a strong package choice?
		- Proxy: Pull all packages through a proxy, configurable for your org, which can automatically sandbox
		- Pre-Commit: Enforce a policy for what packages to allow a developer to use based on the threat model for your organization
	- Pull Request
		- Peer Review: The LunaTrace CI bot reviews your PR to make suggestions about the packages that you have included.
	- Source Control
		- Stop the bleeding: Analyze the full state of the repository and understand where the bleeding needs to be stopped.
		- Active protection: When a package is added to the repository outside of the normal development flow (ie. no PR associated with a push)
	- Build
		- Proxy: Packages are blocked or modified to comply with the LunaTrace Library Insight policy
	- Artifact Repository
		- Compiled Coverage: Having visibility of compiled artifacts
	- Running in Production
		- Reporting: Always know where your weaknesses are. LunaTrace will identify everywhere that your code is running and identify all the packages it is using. Knowing not just what libraries you are using, but also where it is running helps LunaTrace prioritize what
- ## Mission
- ### AppSec teams are
- Too small relative to the number of developers they support at their companies
- Busy with day to day remediation efforts, sifting through noisy findings, etc.
- Desire to build bespoke security frameworks that fundamentally solve known issues (cryptography, authorization, secrets, etc.)
- Typically disconnected from the way that development happens day to day
	- Teams that are not disconnected, spend a considerable amount of bandwidth to keep in sync with how things work
- Might write some software, own some services
	- Often times the code written is unmanaged scripts that are built to meet an immediate requirement
- Compliance requirements detract from meaningful security work
	- They often require a "thin blanket" approach to security (ie. buying a vendor tool to say that they meet X requirement).
	- The focus falls more on story telling rather than data driven efforts.
### Tools that AppSec teams typically buy or build themselves
- Secret scanners
- Package vulnerability scanners
- Cloud policy management
### Problems we want to solve
- Taking the tedious work of prioritizing findings off people's plates
	- Very few vulnerabilities are immediately necessary to patch, using heuristics to guage what is important to address and when will give security teams laser focus to address problems
- Stoping social capital burn by security teams
	- Higher signal to noise ratios means more meaningful tasks being opened
### How we can solve these problems
- Providing more context to findings means less guessing if you should care about a problem
	- Where does a library get used in code?
	- Why was the library included in the project?
	- Do I have any services that are deployed with this code?
- Reusable audits
	- If transient dependency X was included from dependency Y, and dependency Y's usage of X was deemed unexploitable, then all instances of Y -> X are now
	- [[VEX in plain english]]
- Premium support to fill the gaps in a security team's knowledge