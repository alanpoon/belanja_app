npm i --save react-native-crypto
npm i --save react-native-stream
# install peer deps 
npm i --save react-native-randombytes
react-native link react-native-randombytes
# install latest rn-nodeify 
npm i --save-dev rn-nodeify@latest
# install node core shims and recursively hack package.json files 
# in ./node_modules to add/update the "browser"/"react-native" field with relevant mappings 
./node_modules/.bin/rn-nodeify --hack --install