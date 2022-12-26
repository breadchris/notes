- ## Protobuf Demo
- I write some code that does something:
	- ```python
	  // download youtube subtitles with https://github.com/jdepoix/youtube-transcript-api
	  def download_subtitles(video_id: str, language: str) -> bytes:
	    # Import the required modules.
	    from googleapiclient.discovery import build
	    from googleapiclient.errors import HttpError
	  
	    # Set the YouTube API key.
	    youtube_api_key = "YOUR_API_KEY"
	  
	    # Build the YouTube API service.
	    youtube = build("youtube", "v3", developerKey=youtube_api_key)
	  
	    # Set the parameters for the subtitle download request.
	    params = {
	      "part": "snippet",
	      "videoId": video_id,
	      "type": "track",
	      "trackType": "subtitles",
	      "fields": "items(snippet(languageCode))"
	    }
	  
	    # Download the available subtitles for the specified video.
	    try:
	      subtitles = youtube.captions().list(**params).execute()
	  
	      # Check if the specified language is available.
	      for subtitle in subtitles["items"]:
	        if subtitle["snippet"]["languageCode"] == language:
	          # Download the subtitle data in the specified language.
	          params = {
	            "id": subtitle["id"],
	            "tfmt": "vtt",
	            "fields": "data"
	          }
	          subtitle_data = youtube.captions().download(**params).execute()
	  
	          # Return the raw subtitle data.
	          return subtitle_data
	    except HttpError as error:
	      print(f"An error occurred: {error}")
	      return None
	  ```
- I write protobuf types
	- ```protobuf
	  // Define the request message for downloading subtitles from YouTube.
	  message DownloadSubtitlesRequest {
	    // The ID of the YouTube video from which to download subtitles.
	    string video_id = 1;
	  
	    // The language of the subtitles to download.
	    string language = 2;
	  }
	  
	  // Define the response message for downloading subtitles from YouTube.
	  message DownloadSubtitlesResponse {
	    // The raw subtitle data in the specified language.
	    bytes subtitle_data = 1;
	  
	    // The language of the downloaded subtitles.
	    string language = 2;
	  }
	  ```
- A workflow orchestrator lets me seamlessly call this function from my existing backend
	- ```python
	  # Define the HTTP request handler class.
	  class RequestHandler(BaseHTTPRequestHandler):
	    # Handle GET requests.
	    def do_GET(self):
	      # Parse the query string parameters.
	      params = parse_qs(urlparse(self.path).query)
	  
	      # Get the video_id parameter from the request.
	      video_id = params.get("video_id", [""])[0]
	  
	      # Call the download_youtube_subtitles function to download subtitles.
	      subtitles = download_youtube_subtitles(video_id, "en")
	  
	      # Set the response headers.
	      self.send_response(200)
	      self.send_header("Content-type", "text/vtt")
	      self.end_headers()
	  
	      # Set the subtitles as the response body.
	      self.wfile.write(subtitles)
	  
	  # Set the HTTP server address and port.
	  server_address = ("0.0.0.0", 8080)
	  
	  # Create and start the HTTP server.
	  httpd = HTTPServer(server_address, RequestHandler)
	  httpd.serve_forever()
	  ```
- when `download_youtube_subtitles` is called
	- Instead of the underlying code being immediately called, the parameters of the function are serialized
	- workflow is started
	- the original program will block on the function being run.
	- In the workflow, the actual code for `download_youtube_subtitles` will be run and the response will be serialized and returned.
	- The http handler will get the result in `subtitles`.
- Dependencies
	- Dependencies that a function can have are either: Code dependencies, Global State (import db from setup_db), or parameters pass into the function
	- Protobuf lets us serialize parameters (but only ones that can be serialized)
	- What about everything else?
	- As long as you can compile a docker container for the code, code dependencies are fine
	- Global State can't exist, the gavel of the senior dev comes down
	- Parameters that can't be serialized are passed via Dependency Injection
	- Every language will have a protoflow developed Dependency Injection framework
- Why would you do this?
	- Well, what we have effectively done is decoupled the implementation from the definition, meaning the code can be anything and run anywhere.
	- Everything is typesafe because we are using protobuf
- Isn't this horribly inefficient?
	- Yes, if you are always starting a workflow and calling out over the network to run something
	- But you can take functions of the same language and try to stick them into the same process if you can.
	- "A compute compression"
- Meet the developer where they are, but with senior design decisions
	- By having strict types, you shrink the blast radius of problems that can h