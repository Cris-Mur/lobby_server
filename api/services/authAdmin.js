const jwt = require('jsonwebtoken');

// =================================
// Verify Admin Token
// =================================

let verifyAdminRole = (req, res, next) => {
  let Authorization = req.get('accessToken');
  if (!Authorization) {
    console.log('Authorization not found');
    res.status(401).json({ message: 'Authorization token missing' });
  }
  const accessToken = Authorization.split(' ')[1];
    const { role } = jwt.verify(accessToken,
                                process.env.tokenSeed);
  if (role === 'ADMIN_ROLE') {
    next();
  } else {
    res.status(400).json({
      err: {
        message: 'Access Denied! >:v',
      },
    });
  }
};

module.exports = verifyAdminRole;