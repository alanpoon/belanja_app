SCRIPT_DIR=$(dirname "$0")
BASE_DIR=$SCRIPT_DIR/rust

set -e
cd rust && cargo build $1 --target wasm32-unknown-unknown
cd ..
rm -rf $SCRIPT_DIR/dist
mkdir $SCRIPT_DIR/dist
mkdir $SCRIPT_DIR/dist/intermediate
cp $BASE_DIR/target/wasm32-unknown-unknown/debug/rust.wasm $SCRIPT_DIR/dist/intermediate/native.wasm
wasm-bindgen $SCRIPT_DIR/dist/intermediate/native.wasm --out-dir $SCRIPT_DIR/dist
