import React from 'react';
// supposing an "add.wasm" module that exports a single function "add"

const WasmComponent = () => {

  const [wasmModule, setWasmModule] = React.useState();

  const loadWasm = async () => {
   // try {
      console.log("wasm before",new Date())
      const wasm = await import('rust');
      setWasmModule({ wasm });
      console.log('wasm set',new Date());
      
        callFetch(wasm);
      
    //} catch (err) {
    //  console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
    //}
  };

  const callFetch = async (wasm) => {
    console.log('calling fetch');
    //const res =  await wasm.greet("jj");
    const resy =  await wasm.k("127.0.0.1:9444");
    console.log(resy);
  }
/*
  // load wasm asynchronously
  wasmModule === undefined && loadWasm();

  if (wasmModule !== undefined) {
    callFetch(wasmModule);
  }
  */
 wasmModule === undefined && loadWasm();
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default WasmComponent;