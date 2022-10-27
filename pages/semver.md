- semver in sql
	- ```sql
	  CREATE OR REPLACE FUNCTION semver_match(version text, req text) RETURNS boolean
	      LANGUAGE SQL
	      IMMUTABLE
	      RETURNS NULL ON NULL INPUT
	      AS $$ 
	      SELECT CASE
	      WHEN req LIKE '~>%' THEN
	          string_to_array(version, '.')::int[] >= string_to_array(substring(req from 4), '.')::int[]
	          AND
	          string_to_array(version, '.')::int[] <
	          -- increment last item by one. (X.Y.Z => X.Y.(Z+1))
	          array_append(
	              (string_to_array(substring(req from 4), '.')::int[])[1:(array_length(string_to_array(req, '.'), 1) - 1)], -- X.Y
	              (string_to_array(substring(req from 4), '.')::int[])[array_length(string_to_array(req, '.'), 1)] + 1 -- Z + 1
	          )
	      WHEN req LIKE '>%' THEN string_to_array(version, '.')::int[] > string_to_array(substring(req from 3), '.')::int[]
	      WHEN req LIKE '<%' THEN string_to_array(version, '.')::int[] < string_to_array(substring(req from 3), '.')::int[]
	      WHEN req LIKE '>=%' THEN string_to_array(version, '.')::int[] >= string_to_array(substring(req from 4), '.')::int[]
	      WHEN req LIKE '<=%' THEN string_to_array(version, '.')::int[] <= string_to_array(substring(req from 4), '.')::int[]
	      WHEN req LIKE '=%' THEN 
	          (string_to_array(version, '.')::int[])[1:array_length(string_to_array(substring(req from 3), '.'), 1)] = 
	          string_to_array(substring(req from 3), '.')::int[]
	      ELSE NULL
	      END $$;
	  
	  -- tests.
	  SELECT 
	      ver,
	      req,
	      CASE WHEN semver_match(ver, req) = expected
	      THEN '✅' ELSE '❌' END AS test_passed
	  FROM (VALUES
	      ('2.3.1', '> 2.3', TRUE),
	      ('2.3.1', '< 2.3.2', TRUE),
	      ('2.3.1', '~> 2.3.2', FALSE),
	      ('2.4.3', '~> 2.3.2', FALSE),
	      ('2.3.2', '~> 2.3.2', TRUE),
	      ('2.3.2', '= 2.3.2', TRUE),
	      ('2.3.2', '= 2.3', TRUE),
	      ('2.3.2', '= 2.4', FALSE)
	  ) AS _ (ver, req, expected)
	  ```