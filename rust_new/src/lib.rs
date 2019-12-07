use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}
#[wasm_bindgen]
pub fn runz()->String{
    "22".to_string()
}
#[wasm_bindgen]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}