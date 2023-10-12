const GenerateCode = (n) => {
  var add = 1,
    max = 2 + add; // Update the max value to 2 for the year part

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
};

module.exports = GenerateCode;
