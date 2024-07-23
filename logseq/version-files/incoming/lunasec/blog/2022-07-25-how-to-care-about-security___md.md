## Taking Action on Security for Your Company

For companies in the growth phase, it can be difficult to understand what exactly to prioritize as your security team is either non-existant or newly forming. Often times security comes in the form of a penetration tests which is helpful, but only provides point in time awareness of issues vs. proactive defense against threats based on sound security decisions. 

Let's take a look at action items your team can use to embue security to your company's beating heart.

<!--truncate-->

Application security is very challening to get right at any size company. For starters, there are simply not enough cyber security talent to defend the world's infrastructure.

> Together, the Cybersecurity Workforce Estimate and Cybersecurity Workforce Gap
suggest the global cybersecurity workforce needs to grow 65% to effectively defend
organizations’ critical assets. 
[ISC2 Cybersecurity Workforce Study](https://www.isc2.org//-/media/ISC2/Research/2021/ISC2-Cybersecurity-Workforce-Study-2021.ashx)

Without a surplus of talent, it is critical for security teams to have a carefully thought out plan for protecting their assets. With cyber security being a relatively new discipline of study, there are few examples, guides, and/or resources for how to approach organizing your team. One of the best resources you can review is the [OWASP SAMM model](https://owaspsamm.org/model/). This model is an amazing resource which provides both a high level view and insightful details about how your company should be tackling specific security concerns in each area of security.

In this post, the security checkpoints identified by the OWASP SAMM model for "Maturity Level 1" will be presented in such a way that clear action can be taken on them by you and your company. In other words, clear _action items_ will be presented and relevant resources such has open source or commerical tools will be linked to kick start your own journey to building a security team at your company.

> Disclosure: We are the developers of the supply chain defense tool LunaTrace which is mentioned a number of times in this post as a possible solution you can choose. We firmly stand by this tool as one that will provide you value. While its metion is a shameless plug, if you are looking for answers to security questions raised in this post, we are here to help solve your problems.
## Governance
### [Strategy and Metrics](https://owaspsamm.org/model/governance/strategy-and-metrics/)
> Identify objectives and means of measuring effectiveness of the security program.

Like any organized and healthy team, a strategy and quantifiable metrics are needed to understand how effectively a team is at addressing the problem space. Unfortunately in security, measurable metrics are far too often promised in automated tools, but under deliver in [actual value](https://www.lunasec.io/docs/blog/the-issue-with-vuln-scanners/) to an organization.

**Action**: To address metrics that are potential overfitted for security, having a conversation with leadership about _risk tolerance_, or what bad scenarios are actually _really bad_ for the company, is a great way to focus on things that matter. 

**Action**: Create a list of metrics, based on the _really bad_ scenarios, that are managable for the size of the security team at your company. Creating good metrics can be difficult and are not one-size-fits-all. Here are some ideas to get you started creating your own:
#### Security Metric Guidelines
A good security metric is one that can _always be measured_, preferably automatically in a dashboard, but a good ol' SQL query or bash script that can be put into a spread sheet will do the job too.

Every security metric should fall into the category of:
- _Effort_ spent on security - Number/Percent of X that have been Y.
	- Number of hours that have been spent training developers on security best practices.
	- Number of applications that have been code reviewed.
	- Percent of services that have been scanned for vulnerabilities.
- _Result_ of security efforts - By doing X, the number/percent of Y.
	- By identifying security defects in projects, the number of patches that have not been resolved.
	- By performing root cause analysis, the percent of security investigations that were identified to be caused by an application vulnerability.
- _Environment_ the security team operates in - Number/Percent of X in the Y.
	- Number of managed devices in the company.
	- Percent of teams in the organization using a cloud provider.
### Policy and Compliance
Depending on what data your company collects, there may be regulatory requirements for how that is done. For example, if you collect information about a user's medical records, your company must handle this data in a HIPAA compliant way. Understanding what compliance requirements affect your company is _imperitive_ if you wish to avoid [massive fines](https://www.hipaajournal.com/what-are-the-penalties-for-hipaa-violations-7096/). Often times when working with other companies that handle Personal Data themselves, you might be requested to present evidence of an 3rd-party audit, such as SOC 2.

**Action**: Catalogue what data you are collecting and understand what data you are collecting is considered [Personal Data](https://en.wikipedia.org/wiki/Personal_data#). Match this data that you are collecting up to compliance requirements. Understand what the compliance
#### Common Compliance Standards
- GDPR (General Data Protection Regulation)
- HIPAA (Health Insurance Portability and Accountability)
- PCI DSS (Payment Card Industry Data Security Standard)
- CCPA (California Consumer Privacy Act)
- [SOC 2 (System of Organization Controls)](https://en.wikipedia.org/wiki/System_and_Organization_Controls)

> Note: This is not an exhaustive list of standards, there may be more depending on what country you intend on operating in.

**Action**: Depending on how essential collecting Personal Data is to your company, consider contacting a company that specializes in compliance requirements, such as [Vanta](https://www.vanta.com/), to help you understand these compliance requirements better.
### Education and Guidance
Informing developers about security best practices is not just to prevent the simple mistakes of leaving a secret in code. Engineers who design systems with security in mind effortlessly makes your company 10x more secure now and in the future.

It can be difficult to provide education that is relevant to a developer's day to day job without hiring someone to provide bespoke guidance based on your tech stack. The best guidance that a security engineer can truely give to a developer is simple: "ask questions". Encourage developers to ask questions about how secure a stack is and poke holes in how infrastructure is built. Dedicating time to let developers research answers to their security questions will save time and money in the long run.

**Action**: Have developers review the [OWASP Top 10](https://owasp.org/Top10/)list of commonly exploited vulnerabilities and understand how they can be mitigated.

**Action**: Make sure developers are familiar with the [top 10 most commonly exploited web application vulnerabilities](https://www.hackerone.com/top-ten-vulnerabilities) identified by HackerOne.
## Design
### Threat Assessment
> To know your enemy, you must become your enemy.
> ~ Sun Tzu

To perform a meaningful threat assesment means to ask your developers to shift their perspective from writing features, to playing hacker on their own code. The expection should never be for a developer to take the place of a penetration tester, but as the people who are most intimate with details of how the system works, they are the best suited to answer critical security questions.

**Action**: For each project that exists, have each team responsible create an [Application Risk Profile](https://resources.infosecinstitute.com/topic/introduction-to-application-risk-rating-assessment/) where relevant security questions are answered to categorize the service's level of risk.

**Action**: Create a [Threat Model](https://owasp.org/www-community/Threat_Modeling_Process) of your infrastructure and identify weaknesses, or places an attacker could possibly gain access. It not improtant for this process to initially be thorough, as software for a company in growth is constantly changing. Instead, focus on what parts of company are the "keys to the castle" and understand how an attacker could obtain them. Diagrams are your friend. Get in a call with your team and collaboratively work on a [Google Jamboard](https://jamboard.google.com/) or [Lucidchart](https://www.lucidchart.com/) to sketch out your infrastructure.
### Security Requirements
Before writing any code, security should always be considered when planning what to write. Building a system that is "secure by default" because of intelligent security design choices beforehand will continually protect your services from potential compromise. Similar to the "Threat Assessment" section, it is not important for this to be thorough to start. It is also important to note that if you are dealing with Personal Data and will need to meet some compliance standard, letting those requirements drive some part of your roadmap early on will enable your team to confidently clear an audit without disrupting feature development.

**Action**: When planning features for a project, allocate time to answer the question "What are the security requirements of what is being built?". Using [OWASP's ASVS](https://owasp.org/www-project-proactive-controls/v3/en/c1-security-requirements) can help your team identify what those considerations would be based on what is being built.

**Action**: If 3rd party vendors are handling critical data for your company, perform a [Vendor Security Review](https://hockeyinjune.medium.com/vendor-security-review-197effb286bd) to understand if their company follows similar security practices to yours.
### Security Architecture
Translating "Secure Requirements" to tasks on a roadmap can be challenging, especially for teams without developers experienced in security. Identifying frameworks that are well designed, actively developed, and built with security in mind will put wind in your team's sails. There will be more documentation reading and less wheel re-inventing if answers to common security questions are readily available.

For example, [React](https://reactjs.org/) or [Vue](https://vuejs.org/)are popular web frameworks that provide a number of "secure by default" features to prevent the most common web application vulnerability, [XSS](https://owasp.org/www-community/attacks/xss/). Recommending a cryptography library, such as [Google Tink](https://github.com/google/tink) or [LibSodium](https://doc.libsodium.org/)will enable developers to tackle, the otherwise challenging task, of encrypting data to meet compliance requirements. Cloud providers, such as AWS, GCP, Azure, etc., all have [security controls](https://www.paloaltonetworks.com/blog/2020/02/cloud-iam-security/) that can be configured to isolate and protect services from each other in the case of a compromise.

**Action**: For common types of projects that your company might develop (ie. a frontend website, backend microservice, etc.) identify and recommend frameworks that have been vetted to be both functional and secure. 

**Action**: Promote the use of a secrets manager when secrets are needed in code. Most cloud providers offer an integrated service to make this trivial to do. For example, AWS has the [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/).
## Implementation
### Secure Build
Continually building your project (a.k.a. Continuous Integration or CI)

**Action**: Strive to make all builds repeatable. Having a design pattern accessible to developers, when creating new projects, will greatly help this process. If you are using Github, they provide an easy way to integrate this into your pull requests with [Workflows](https://docs.github.com/en/actions/using-workflows/about-workflows).
**Action**: Inventory all of your service's dependencies as a Bill of Materials. Using a tool like [LunaTrace](https://www.lunasec.io/pages/live-dependency-patching) will help you achieve this automatically.
### Secure Deployment
Once you can continually build your project, the next step is to be able to continually deploy (a.k.a. CD, together they are the CI/CD pipeline).

**Action**: Document how the deployment process is handled. Understanding who has access to this process is _critical_. Unauthorized deployment of code can very easily lead to a bad security compromise.
### Defect Management
Vulnerabilities are going to be discovered in your application. Whether they are found internally by a developer or externally by a security researcher in a [bug bounty program](https://www.freecodecamp.org/news/whats-a-bug-bounty-program/). Establishing a culture around the reporting and management of vulnerabilities determines how quickly you can stop the bleeding of a potential compromise.

**Action**: Keep track of discovered vulnerabilities on a task board or with a vulnerability management tool such as [LunaTrace](https://www.lunasec.io/pages/live-dependency-patching).

**Action**: Incentivize developers to take ownership of remediating security vulnerabilities and recognize them for the work that they do outside of their day to day feature development.
## Verification
### Architecture Assessment
Once the "Design" and "Implementation" phases are complete for a project, it can be important to review and verify what was actually developed. It is possible that requirements were lost in translation from design to implementation and if those requirements were business critical, as is the case with compliance requirements, then significant risk exists. 

**Action**: Plan a meeting to have developers with the most experience with security review the design requirements and poke holes in the implementation to see if they were met. This can be considered a mini, in-house penetration test.
### Requirements-driven Testing
To make sure that vulnerabilities can't exist in code, writing tests is the best, most direct defense. Just like most tests however, getting complete coverage over all cases can be difficult. To make sure time spent writing security tests is done effectively, focus on the parts of your code that were identified in the "Threat Assessment" phase and write tests that address the following:
- Authentication - Does the user have permission to have access to some endpoint they shouldn't?
- Authorization - Can a user successfully perform some action through the API they shouldn't?
- Input Validation - If some malicious text is sent to the frontend or backend, is it blindly trusted? or is it sanitized?
- Encryption - If some data is sent from point A to point B, can someone in between see its contents when they shouldn't?

For examples of security driven unit tests, published [Github Security Advisories](https://github.com/advisories) will often include the pull request that was made in response to a vulnerability. For example the package `thenify` had a [critical vulnerability](https://github.com/advisories/GHSA-29xr-v42j-r956) and was fixed and had security regression tests add in [this commit](https://github.com/thenables/thenify/pull/30/files#diff-a561630bb56b82342bc66697aee2ad96efddcbc9d150665abd6fb7ecb7c0ab2fR72).

**Action**: Write unit/integration tests that verify the existence of basic security controls. These might be proactively written to make sure fundamental compliance requirements are met or retroactively written in response to discovered vulnerabilities to prevent regressions.
### Security Testing
Security testing comes in two forms: manual and automatic.
#### Manual testing
This will provide a point in time review of your project and help you fill in the gaps of your own security knowledge. These types of tests will not just give you a fishing rod, but also help you learn how to fish, so to speak. Do not treat findings from a manual audit as the end all, be all solution to your security as a company. Feed these findings back into your "Design" phase to better equip your own developers to make more secure decisions. Some recommended companies that will help you in this space are:
- [NCC Group](https://www.nccgroup.com/us/)
- [Bishop Fox](https://bishopfox.com/services/application-security)
  
**Action**: Use your "Threat Assessment" as a treasure map to enable a pentest team to come in and pick apart your infrastructure.
#### Automatic testing
This means installing a service into your CI/CD to raise alarms when security issues are found. The big question to ask when choosing an automatic testing service is: "What are the actual 'security issues' being looked for?". We have [written about this before](https://www.lunasec.io/docs/blog/the-issue-with-vuln-scanners/), but far too often what findings you end up with won't actually be at all meaningful to a developer. It is _imperitive_ that you value signal (meaningful findings) over noise (false positives) when it comes to automatic tools, because there are...[a lot of tools](https://owasp.org/www-community/Vulnerability_Scanning_Tools). At risk of sounding like a pharmaceutical company, we give you the best advice in this space: "ask your security professional what is right for you". Here are some tools (not exhaustive) that we trust to continually deliver high signal to noise ratios:
- [Github CodeQL](https://codeql.github.com/)
- [Detectify](https://detectify.com/)
- [LunaSec](https://www.lunasec.io/)
- [SemGrep](https://semgrep.dev/)

**Action**: Using your "Threat Assessment" as a guide, identify what services you care about the most to introduce automatic testing on. The initial rollout of a tool should be in "report only" mode for your security team to review. Over time, if you are receiving valuable, actionable results, then graduate this tool to start to take action on pull requests or generate tasks.
## Operations
### Incident Management
If/when a security breach happens, you will want to respond to these events quickly and decisively. It is _essential_ that you are able to collect production logs from the possible compromise window. While certain attacks might be impossible to see in application logs,  you may be able to see attempts at accessing different resources.

Any work that you have put into having a "Secure Build" and a "Secure Deployment" will pay dividens during an incident. Being able to quickly identify the issue from the logs, to writing a fix, and then rolling out a deploy could be the difference between a minor and a major exposure. Having a runbook available for how to handle these incidents will improve communication during an otherwise chaotic time.

**Action**: Make sure logs are being collected in production and enough information is being collected from critical services that will help during an investigation. Additionally, if your cloud provider provides access logs for its services, identify this feature and consider using it from your most critical services.

**Action**: Make sure your on-call rotation has a runbook for handing incident management.
### Evironment Management
As a quickly growing company, you will use any technology at your disposal to scale and grow. The side effect of this is that most likely you will not have "experts" of this technology and a possible misconfiguration or unpatched vulnerability is inevitable. Unless you have a dedicated team to constantly identify and patch outdated versions of software, you are unlikely to truely get ahead of this problem. This has become such a significant problem, that there have been [govenerment organizations and an executive order](https://www.cisa.gov/sbom) that have been made in response to this problem. 

Even if you had a tool that inventories all of your software, the next step would be to identify _when_ an update is needed. There may be updates to software that are simply bug fixes, but there will also be times that a fix for a critical vulnerability has been issued. For small teams that are rapidly growing, the last thing you will want to do is become a full time package update-er. An automated solution should tell you to update if, and only if, it is needed.

**Action**: Choose software/services that you use carefully and follow the recommendations outlined in "Secure Requirements".

**Action**: Consider using a tool like [LunaTrace](https://www.lunasec.io/pages/live-dependency-patching) that will automatically keep an up to date inventory of software that you are using to understand _when_ and _where_ you need to focus your attention on updating software.
### Operational Management
A project will hopefully have outlined how to handle data in the "Security Requirements" section of this post. If this was not translated into code during the "Implementation" phase, then hopefully this would have been caught during "Verification". Even with the existence of these formalized processes, it will always be everyone's job to constantly watch for and raise awareness when data is not handled properly. Data, for most companies, is the reason they exist and make money. Compliance requirements ensure that a company will not go unpunished for incorrectly handling a user's data. 

**Action**: Instill in your teams to be vigilant about how data is accessed and processed. Encourage them to take time to make sure "the right thing" is done with the data. If there is an ambiguity about how data should be handled, contract a security professional to provide guidance.

**Action**: Make sure legacy services are decomissioned properly and no data is being processed by them. As compliance requirements change for a company, old, forgotten services will be some of the first targets an attacker will set their sights on.
### Conclusion
As your company rapidly grows, it will be difficult for the security team to keep pace. The best advice we can offer is simple: "uphold the bottom line". The terms "data breach", "cryptolocker", and "critical vulnerability" have flooded the news and have been very successful at distracting from the things that matter. Security companies make their money off of fear, and in turn and not incentivized to really _calm_ the fear that a company might have about security. 

We believe that every company is capable of running their own successful, security team. An important first step to making that happen is help companies dispell the snake oil that is far too often sold in the security space.

We hope this post helps you along your journey for taking action on security at your company :)