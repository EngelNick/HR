const crypto = require('crypto').randomBytes(256).toString('hex');
    
module.exports = {
    // uri: 'mongodb://localhost:27017/site',
    uri: 'mongodb://Nikolay:engel165@ds141274.mlab.com:41274/hrit',
    secret: 'crypto',
    db: 'hrit'
}