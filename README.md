# weather-mix
Web application that recommends SoundCloud playlists based on current weather conditions.

# Installation Instructions
1. Go ahead and ```git clone``` the entire repo into your local file system.
2. ```cd``` into your project repo. Notice that there is currently no content under the soundcloud-javascript sdk folder.
You will have to import the contents of the submodule by doing the following commands: ```git submodule init``` followed by ```git submodule update```
3. After the dependencies are installed, you will have to modify ```soundcloud-javascript/webpack.config.js``` under the SoundCloud SDK submodule to serve content from the ```weather-mix``` directory. Modify the `contentBase` directive on line 31 in to read ```../weather-mix``` rather than ```./example```
4. The project listens on port 8080 by default, if you would like to use a different port, modify ```soundcloud-javascript/serve.js``` and change the port number in line 9.
5. To build and run the SDK, `cd` into the `soundcloud-javascript` directory and run `make setup`, followed by `make build`, then `make run-with-watcher` to run the server.

*Note: More information about the SoundCloud SDK can be found in the `README.md` file located in the `soundcloud-javascript` directory.*
