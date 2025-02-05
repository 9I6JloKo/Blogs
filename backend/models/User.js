const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    bio: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    favouriteArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSubscription',
      },
},
    {
        timestamps: false,
        versionKey: false,
    }
);

userSchema.plugin(uniqueValidator);

//Генерация токена. Нужна правильная почта и пороль
userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({
            "user": {
                "id": this._id,
                "email": this.email,
                "password": this.password
            }
        },
        'secretkey',
        { expiresIn: "1d"}
    );
    return accessToken;
}

//возвращает ответ, ввиде информации пользователя
userSchema.methods.toUserResponse = function() {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: this.generateAccessToken()
    }
};

//профиль
userSchema.methods.toProfileJSON = function (user) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image,
        following: user ? user.isFollowing(this._id) : false
    }
};

userSchema.methods.isFollowing = function (id) {
    const idStr = id.toString();
    for (const followingUser of this.followingUsers) {
        if (followingUser.toString() === idStr) {
            return true;
        }
    }
    return false;
};

//profile следить
userSchema.methods.follow = function (id) {
    if(this.followingUsers.indexOf(id) === -1){
        this.followingUsers.push(id);
    }
    return this.save();
};

userSchema.methods.unfollow = function (id) {
    if(this.followingUsers.indexOf(id) !== -1){
        this.followingUsers.remove(id);
    }
    return this.save();
};

//Articles - добавить в массив любимые
userSchema.methods.isFavourite = function (id) {
    const idStr = id.toString();
    for (const article of this.favouriteArticles) {
        if (article.toString() === idStr) {
            return true;
        }
    }
    return false;
}

userSchema.methods.favorite = function (id) {
    if(this.favouriteArticles.indexOf(id) === -1){
        this.favouriteArticles.push(id);
    }
    return this.save();
}

userSchema.methods.unfavorite = function (id) {
    if(this.favouriteArticles.indexOf(id) !== -1){
        this.favouriteArticles.remove(id);
    }
    return this.save();
};

module.exports = mongoose.model('User', userSchema);