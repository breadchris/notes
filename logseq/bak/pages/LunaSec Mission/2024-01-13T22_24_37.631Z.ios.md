title:: lunasec/mission

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