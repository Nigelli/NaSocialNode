var mongoose = require('mongoose');
var brcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    description: String,
})

userSchema.pre('save', function(next) {
    var user = this;
    
    if (!user.isModified('password')) {
        return next();
    }
    
    brcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
    })

})

module.exports = mongoose.model('User', userSchema)