// 导入我们jwt的secret
const { secret } = require('./index')

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
console.log('ExtractJwt-->', ExtractJwt);
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
console.log('opts.jwtFromRequest--->', opts.jwtFromRequest);
opts.secretOrKey = secret;

const User = require('../modules/User')

module.exports = passport => {
  passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log('jwt_payload', jwt_payload);
    // 通过token中的id，获取用户信息
    let user = await User.findById({ _id: jwt_payload.id })

    console.log(user);

    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
    // User.findOne({ id: jwt_payload.sub }, function (err, user) {
    //   if (err) {
    //     return done(err, false);
    //   }
    //   if (user) {
    //     return done(null, user);
    //   } else {
    //     return done(null, false);
    //     // or you could create a new account
    //   }
    // });
  }));
}