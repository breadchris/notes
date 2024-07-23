# Vex
vex  /veks/

verb
make (someone) feel annoyed, frustrated, or worried, especially with trivial matters.
"the memory of the conversation still vexed him"

  
“Even though CVE Y is found in component X, and component X is included in our product, CVE Y isn’t in fact exploitable in our product.”
### References

[CycloneDX - Vulnerability Exploitability Exchange (VEX)](https://cyclonedx.org/capabilities/vex/)
[Vulnerability-Exploitability eXchange (VEX) – An Overview](https://www.ntia.gov/files/ntia/publications/vex_one-page_summary.pdf)
[What is VEX? A) What reading this blog does to me, or B) A new advisory format that's just as important as SBOMs?](https://tomalrichblog.blogspot.com/2021/09/what-is-vex-what-reading-this-blog-does.html)
# Short Description
The purpose of VEX is to describe the exploitability and occurrence of vulnerabilities in a sub-dependency of the package or product it is attached to.  
  
VEX is a “use case” of CycloneDX SBOM schema that leverages new fields that were added in version 1.4. VEX is implemented by providing additional notes/fields on vulnerabilities presented in an SBOM.

VEX can also be implemented in multiple standards or frameworks. VEX has been implemented as a profile in the Common Security Advisory Framework (CSAF). VEX, as defined by CSAF, can also provide rich information, such as remediation, workarounds, restart/downtime required, scores, and risks that can be provided by vendors, systems integrators, and operators. 

VEX has also been implemented by CycloneDX. CycloneDX is an SBOM standard that is widely used. CycloneDX is available in Protobuf whereas CSAF is a loose standard.

Imo cyclonedx implementation is more useful
# Why do we care?
NTIA frames VEX as being used by the software vendor to describe their manual security analysis and reduce noise from security scanners in Enterprise customers of the vendor. There’s more we can do with it though.

… VEX isn’t just an adjunct document for SBOMs; it could come to be a key element of software supply chain security in its own right, as important as SBOMs themselves.
-   [What is VEX? A) What reading this blog does to me, or B) A new advisory format that's just as important as SBOMs?](https://tomalrichblog.blogspot.com/2021/09/what-is-vex-what-reading-this-blog-does.html)
# What can we do?
VEXes consist of context (the SBOM they are in) and an analysis (VulnerabilityAnalysis message). 
We should create a global index of VEXes with context (links to package.relase) in the LunaTrace schema.

Goals:
-   Enrich SBOMs without VEX data from global index
-   Enrich SBOMs with existing VEX data with static analysis results
-   Make manual security analysis interoperable with SBOM risk assessment tools

Requirements:
-   VEX MUST be able to be created manually
-   VEX SHOULD be able to be imported
-   We MAY scrape the internet for SBOMs that contain VEXes to seed the database
-   We MAY create VEX messages with static analysis tools
-   Automatically apply IMPACT_ANALYSIS_JUSTIFICATION_CODE_NOT_REACHABLE, etc

Some ImpactAnalysisJustifications can be used to rule out vulns in transitive deps. Ex. CODE_NOT_PRESENT and CODE_NOT_REACHABLE
# API Spec
## CSAF
[https://docs.oasis-open.org/csaf/csaf/v2.0/csd01/csaf-v2.0-csd01.html#45-profile-5-vex](https://docs.oasis-open.org/csaf/csaf/v2.0/csd01/csaf-v2.0-csd01.html#45-profile-5-vex)
A CSAF document SHALL fulfill the following requirements to satisfy the profile "VEX":
-   The following elements must exist and be valid:
	-   all elements required by the profile "Generic CSAF".
	-   /product_tree which lists all products referenced later on in the CSAF document regardless of their state.
	-   at least one of
		-   /vulnerabilities[]/product_status/fixed
		-   /vulnerabilities[]/product_status/known_affected
		-   /vulnerabilities[]/product_status/known_not_affected
		-   /vulnerabilities[]/product_status/under_investigation
	-   at least one of
		-   /vulnerabilities[]/cve
		-   /vulnerabilities[]/id
		-   /vulnerabilities[]/notes
	- Provides details about the vulnerability.
-   For each item in
	-   /vulnerabilities[]/product_status/known_not_affected an impact statement SHALL exist in /vulnerabilities[]/threats. The category value for such a statement MUST be impact and the details field SHALL contain a a description why the vulnerability cannot be exploited.
	-   /vulnerabilities[]/product_status/known_affected additional product specific information SHALL be provided in /vulnerabilities[]/remediations as an action statement. Optional, additional information MAY also be provide through /vulnerabilities[]/notes and /vulnerabilities[]/threats.  
	    The use of the categories no_fix_planned and none_available for an action statement is permitted.
-   Even though Product status lists Product IDs, Product Group IDs can be used in the remediations and threats object. However, it MUST be ensured that for each Product ID the required information according to its product status as stated in the two points above is available. This implies that all products with the status known_not_affected MUST have an impact statement and all products with the status known_affected MUST have additional product specific information regardless whether that is referenced through the Product ID or a Product Group ID.
-   The value of /document/category SHALL be vex.
## CycloneDX
[https://github.com/CycloneDX/specification/blob/master/schema/bom-1.4.proto#L592-L650](https://github.com/CycloneDX/specification/blob/master/schema/bom-1.4.proto#L592-L650)
```protobuf
message VulnerabilityAnalysis {

 // Declares the current state of an occurrence of a vulnerability, after automated or manual analysis.

 optional ImpactAnalysisState state = 1;

 // The rationale of why the impact analysis state was asserted.

 optional ImpactAnalysisJustification justification = 2;

 // A response to the vulnerability by the manufacturer, supplier, or project responsible for the affected component or service. More than one response is allowed. Responses are strongly encouraged for vulnerabilities where the analysis state is exploitable.

 repeated VulnerabilityResponse response = 3;

 // Detailed description of the impact including methods used during assessment. If a vulnerability is not exploitable, this field should include specific details on why the component or service is not impacted by this vulnerability.

 optional string detail = 4;

}

  

enum ImpactAnalysisState {

 // An undefined impact analysis state

 IMPACT_ANALYSIS_STATE_NULL = 0;

 // The vulnerability has been remediated.

 IMPACT_ANALYSIS_STATE_RESOLVED = 1;

 // The vulnerability has been remediated and evidence of the changes are provided in the affected components pedigree containing verifiable commit history and/or diff(s).

 IMPACT_ANALYSIS_STATE_RESOLVED_WITH_PEDIGREE = 2;

 // The vulnerability may be directly or indirectly exploitable.

 IMPACT_ANALYSIS_STATE_EXPLOITABLE = 3;

 // The vulnerability is being investigated.

 IMPACT_ANALYSIS_STATE_IN_TRIAGE = 4;

 // The vulnerability is not specific to the component or service and was falsely identified or associated.

 IMPACT_ANALYSIS_STATE_FALSE_POSITIVE = 5;

 // The component or service is not affected by the vulnerability. Justification should be specified for all not_affected cases.

 IMPACT_ANALYSIS_STATE_NOT_AFFECTED = 6;

}

  

enum ImpactAnalysisJustification {

 // An undefined impact analysis justification

 IMPACT_ANALYSIS_JUSTIFICATION_NULL = 0;

 // The code has been removed or tree-shaked.

 IMPACT_ANALYSIS_JUSTIFICATION_CODE_NOT_PRESENT = 1;

 // The vulnerable code is not invoked at runtime.

 IMPACT_ANALYSIS_JUSTIFICATION_CODE_NOT_REACHABLE = 2;

 // Exploitability requires a configurable option to be set/unset.

 IMPACT_ANALYSIS_JUSTIFICATION_REQUIRES_CONFIGURATION = 3;

 // Exploitability requires a dependency that is not present.

 IMPACT_ANALYSIS_JUSTIFICATION_REQUIRES_DEPENDENCY = 4;

 // Exploitability requires a certain environment which is not present.

 IMPACT_ANALYSIS_JUSTIFICATION_REQUIRES_ENVIRONMENT = 5;

 // Exploitability requires a compiler flag to be set/unset.

 IMPACT_ANALYSIS_JUSTIFICATION_PROTECTED_BY_COMPILER = 6;

 // Exploits are prevented at runtime.

 IMPACT_ANALYSIS_JUSTIFICATION_PROTECTED_AT_RUNTIME = 7;

 // Attacks are blocked at physical, logical, or network perimeter.

 IMPACT_ANALYSIS_JUSTIFICATION_PROTECTED_AT_PERIMETER = 8;

 // Preventative measures have been implemented that reduce the likelihood and/or impact of the vulnerability.

 IMPACT_ANALYSIS_JUSTIFICATION_PROTECTED_BY_MITIGATING_CONTROL = 9;

}

  

enum VulnerabilityResponse {

 VULNERABILITY_RESPONSE_NULL = 0;

 VULNERABILITY_RESPONSE_CAN_NOT_FIX = 1;

 VULNERABILITY_RESPONSE_WILL_NOT_FIX = 2;

 VULNERABILITY_RESPONSE_UPDATE = 3;

 VULNERABILITY_RESPONSE_ROLLBACK = 4;

 VULNERABILITY_RESPONSE_WORKAROUND_AVAILABLE = 5;

}
```