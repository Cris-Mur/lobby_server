const jwt = require('jsonwebtoken');
const chckAuth = (Authorization) => {
    if (!Authorization) {
      console.log('Authorization not found');
      return false;
    }
    else {
        try {
            const accessToken = Authorization.split(' ')[1];
            const token = jwt.verify(accessToken, process.env.tokenSeed);
            return token;
        } catch (err) {
            return false,
            console.log('verif token failed')
        }
    }
};
module.exports = chckAuth