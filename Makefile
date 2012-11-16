server:
	nodemon server.js --watch ./server.js

build:
	browserify-server --bundle=browser/client.js \
		-o ./static/bundle.js

watch-build:
	wr -v -c 5 "make build" \
		browser model.js magic.js help.json logic.js

live-reload:
	live-reload --delay=1000
