import * as Random from 'expo-random';
function randomBytes(len){
  const buffer = await Random.getRandomBytesAsync(len);
  return buffer;
}
export{
  randomBytes
}