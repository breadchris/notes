- ## LunaTrace
- ### Meaningfully Managing Vulnerabilities and Malware for Fast Moving Teams
	- LunaTrace: Trace your code to the source
		- <img src="https://mermaid.ink/img/ICBmbG93Y2hhcnQgVEQKICAgIEFbVGFza10gLS0-IEJbRGV2ZWxvcGVyXQogICAgQiAtLT4gQ3tVc2UgYSBsaWJyYXJ5P30KICAgIEMgLS0-IHxZZXN8IERbSW1wb3J0IGxpYnJhcnldCiAgICBEIC0tPiBFW1B1bGwgUmVxdWVzdF0KICAgIEMgLS0-IHxOb3wgSFtXcml0ZSBjb2RlXQogICAgSCAtLT4gRQogICAgRSAtLT4gRltTb3VyY2UgQ29udHJvbF0KICAgIEYgLS0-IEdbQnVpbGRdCiAgICBHIC0tPiBJW0FydGlmYWN0IFJlcG9zaXRvcnldCiAgICBJIC0tPiBKW1J1bm5pbmcgaW4gUHJvZHVjdGlvbl0K" />
		  {{renderer :mermaid_azljpgref}}
			- ```mermaid 
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
	- Every time a developer is working on a task, there is simple choice that they can make: "Do I solve this task with a library, or should I write the code myself?".
	- While a simple choice on the surface, there are a number of things that you should be considering, that maybe aren't so obvious.
		- Before installing that library, are you going to go look at the code?
	- LunaTrace: Automated Security Peer Review, with a personal touch
	- LunaTrace Proactive Resolution
	- LunaTrace Library Insight
		- npms.io score
		- https://www.phylum.io/ risk framework
		- snyk package score
	- LunaTrace Answers to Problems
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
- [[LunaSec Mission]]
-