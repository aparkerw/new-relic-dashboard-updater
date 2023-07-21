const ObjectToGraphQl = (obj) => {
  // replace all quotes around the keys
  let objJson = JSON.stringify(obj);
  let resp = objJson.replace(/"([^"]*)":/g,"$1:");
  return resp;
}

export default { ObjectToGraphQl };