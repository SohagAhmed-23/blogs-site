const jwt = require('jsonwebtoken');
const secret = "sohag@1234!@#$";

class UserAuth {
    
    static createTokenForUser(user) {
        const payload = {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            profilePic : user.profileImgUrl,
            role:user.role
        };

        return jwt.sign(payload, secret, { expiresIn: "1h" });
    }

  
    static validateToken(token) {
        try {
            return jwt.verify(token, secret);
        } catch (err) {
            throw new Error("Invalid or expired token");
        }
    }
}

module.exports = UserAuth;
