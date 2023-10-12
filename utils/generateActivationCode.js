const generateActivationCode = (n) => {
    const alphanumericChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
  
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
      code += alphanumericChars[randomIndex];
    }
      return code;
  };
  
  module.exports = generateActivationCode;
  