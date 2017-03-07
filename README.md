# weather-mix
Web application that recommends SoundCloud playlists based on current weather conditions.

# Installation Instructions
1. Go ahead and ```git clone``` the entire repo into your local repo
2. ```cd``` into your project repo. Notice that there is currently no content under the soundcloud-javascript sdk folder. 
You will have to import the contents of the submodule by doing the following commands: ```git submodule init``` followed by ```git submodule update```
3. Once the files have been transfered over, you will have to modify the ```webpack.config.js``` under the newly import submodule to serve content from the ```weather-mix``` directoty. Modify the file to read ```../weather-mix``` rather than ```./example```

Your should be good to go! :)
