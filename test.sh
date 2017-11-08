node ./test_utils/server.js &
sleep 5
./node_modules/.bin/mocha --reporter spec \
&& pkill -f server.js