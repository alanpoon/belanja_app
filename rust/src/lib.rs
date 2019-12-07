
use primitives::sr25519::Pair;
//use keyring::AccountKeyring;
use wasm_bindgen::prelude::*;
use substrate_api_client::{
    Api,
};
#[wasm_bindgen]
pub fn k(url:&str)->String{
    //let signer = AccountKeyring::Alice.pair();
    let mut api:Api<Pair> = Api::new(format!("ws://{}", url));
    // get some plain storage value
    let result_str = api.get_storage("Balances", "TotalIssuance", None).unwrap();
    //let result = hexstr_to_u256(result_str).unwrap();
    result_str
}

#[wasm_bindgen]
pub fn runz()->String{
    "22".to_string()
}
#[wasm_bindgen]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
