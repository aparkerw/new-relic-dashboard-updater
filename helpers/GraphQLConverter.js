const ObjectToGraphQl = (obj) => {
  // replace all quotes around the keys
  let objJson = JSON.stringify(obj);
  console.log(objJson);
  let resp = objJson.replace(/"([^"]*)":/g,"$1:");
  console.log(resp);
  return resp;
}

export default { ObjectToGraphQl };