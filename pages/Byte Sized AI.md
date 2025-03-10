- motivation
	- AI is changing everything around us. The barrier to entry for the most transformative, state of the art tech is rapidly decreasing. We are on the cusp of a major revolution in the way that we think. There are AI news letters out there, but man, they just don't work for me. A lot of them are simply "link dumps" which I find to be way more noisy than useful. There is enough information out there to start consolidating the firehose into small chunks of digestible information which, hopefully, someone can walk away from reading with knew insight percolating in their daily lives.
	- AI is only going to change things for the better if we are all on board and fighting for accessibility. Let's make it happen! I hope this newsletter provides value to you and gets you as excited as I am about the possibilities!
- syllabus
	- 10 week AI intensive with topics that chris cares about
	- yiannis's thoughts
		- goals
			- build "reasoning engine"
			- Catching GPT when it is wrong
		- IDE environment
			- hello world
				- python environment with pytorch
				- Ubuntu
				- huggingface model running
				- https://huggingface.co/models
		- #books/recs George Boole's book Laws of Thought
			- true false statement, IFTTT
			- agrees or disagrees, introduces their own reason
			- probabilities determine next work, temp changes output
		- MIT 1975 model trained on building sorting algorithms
- topics
	- Models Overview
	  collapsed:: true
		- Read
			- ((646aaa70-bb50-4c10-a2ed-aa0d9bcd8388))
		- Code
			- Go to hugging face and find a transformer that would help you come up with recipe ideas?
	- Prompt Engineering
	  collapsed:: true
		- Read
			- link to that girl's collection of prompt engineer techniques
		- Code
			- plugin for chrome that has prompts that people have shared
			- Run a poorly written prompt and see its output. Think how can it be better?
			- AI likes to "play pretend" so think of relevant archetypes or people who, in real life, might be able to do a better job. For example, if I want AI to write a "better" paper, I could say "You graduated from NYU with a major in English. You are a distinguished writer for the NYT. Write me..."
	- Semantic Kernel
		- https://learn.microsoft.com/en-us/semantic-kernel/overview/
	- llama index
		- I prefer this over langchain because llama index is more focused on foundational topics
	- lunapipe
		- Read
			- Tools for AI are integral for a world that runs on "flow". When we become blocked because we don't quite understand something, we are losing value. Always being able to get a second opinion on something or a quick reference where you don't have to break away from what you are doing provides compounding value for you.
			- https://lunabrain.com/blog/lunapipe-introduction-bash-pipelining-for-llms/
			- why
				- If you want to code something, and you get stuck, or you don't even know what language, don't break your flow! Stack overflow has been the quintessential source of knowledge for programming, but it unfortunately has been losing in the "SEO wars". LLM's have "borrowed"
		- Code
			- Use lunapipe to take some content in your terminal and feed it through the tool.
			- Things to try:
				- Build a bash command that determines how big each file is.
				- Ask it to generate documentation for code.
				- Have it come up with the json schema for data in a csv file.
			- Write a template in LunaPipe to play with the idea of plugins for AI. Include any data that you want to and transform it.
	- searching
	  collapsed:: true
		- bm25 vs semantic similarity with embeddings
	- history?
	- art
	  collapsed:: true
		- Read
		  collapsed:: true
			- Stable diffusion?
		- Code
		  collapsed:: true
			- Set up stable diffusion to generate you an image from a prompt
	- impersonation
		- Read
		- Code
			- Clone your voice or others: https://github.com/CorentinJ/Real-Time-Voice-Cloning
			- Generate a transcript
			  id:: 64710cbf-4d97-4755-aaeb-38b1d3cdf077
	- security
		- Read
		  collapsed:: true
			-
		- Code
			- CTF? break out of sandbox
	- legal considerations
	- scaling
	  collapsed:: true
		- Read
		  collapsed:: true
			- Federated Learning
		- Code
		  collapsed:: true
			- ?
- format
  collapsed:: true
	- thoughts
		- 10000 foot view from my perspective of where AI is and where it is going
	- read
		- what
			- something that you can read in 10min or less
		- why
			- questions related to the content
	- code
		- what
			- something that you can set up and run in 10min or less
			- preferably something you can run in code spaces
		- why
			- questions related to the content
- thoughts
	- As far as training your own model, I think the best place to start would be to set this up https://github.com/lxe/simple-llm-finetuner. The guy who put this together is in our discord and it works pretty well. It makes it very easy to fine tune llama. As far as homework I can assign you to read, https://learn.microsoft.com/en-us/semantic-kernel/overview/ is definitely the best thing you can be reading/thinking about. Fine tuning models is going to go through a lot of aggressive shifts in the coming years as different models gain or lose popularity/maintainability/keep pace. What is not going to be going away is the higher level understanding of LLMs being reasoning engines which are effectively a “fuzzy function”. This was effectively what we were building into lunatrace with the discord bot before we transitioned to doing fully AI. And like with all things research, if Microsoft is formalizing these ideas now, they are going to be relevant for the next decades.