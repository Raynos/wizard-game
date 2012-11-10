server:
	./node_modules/.bin/nodemon server.js --watch ./server.js

build:
	./node_modules/.bin/browserify-server \
		--bundle=client.js -o ./static/bundle.js

watch-build:
	./node_modules/.bin/wr -v -c 5 "make build" \
		client.js model.js static node_modules ui entities \
		name.js

live-reload:
	./node_modules/.bin/live-reload --delay=1000
