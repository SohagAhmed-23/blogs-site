const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const UserAuth = require('../services/auth')

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImgUrl: {
        type: String,
        default: '/images/defualt.jpg',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",  
    },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified("password")) return next();
    const salt = randomBytes(16).toString('hex');  
    const hashPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    user.salt = salt  ;

    user.password = hashPassword;

    next();
});

userSchema.static('matchPassword', async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const hashPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (userProvidedHash !== hashPassword) throw new Error('Incorrect password');
    
    const token = UserAuth.createTokenForUser(user);

    return token;
});

const User = model('User', userSchema);
module.exports = User;


