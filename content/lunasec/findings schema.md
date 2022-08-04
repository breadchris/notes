---
title: "/lunasec/ | findings schema"
---

### current findings schema
id uuid
created_at timestamp
updated_at timestamp
vulnerability_id uuid
vulnerability_package_id uuid
package_version_id uuid
scan_id uuid
build_id uuid
fix_state fix_state_enum
fix_versions text[]
package_name text
version text
version_matcher text
type text
locations text[]
language text
purl text
virtual_path text
matcher text
dedupe_slug text
severity severity_enum