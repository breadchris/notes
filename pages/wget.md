- ## Scraping with wget more intelligently
	- https://stackoverflow.com/questions/17182553/sites-not-accepting-wget-user-agent-header
	- ~/.wgetrc
		- ```
		  header = Accept-Language: en-us,en;q=0.5
		  header = Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
		  header = Connection: keep-alive
		  user_agent = Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0
		  referer = /
		  robots = off
		  ```