function randomString(length) {
  var result = "";
  var characters = "Gz0189AWXvBH23YZt6u4KLMNOPIVwxyTJ5RS7sCDEQabrUF";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * Math.floor(Math.random() * charactersLength))
    );
  }
  return result;
}
module.exports = randomString;
