var Q = require('q');
var validateAccount = require('common/validateAccount');

module.exports = function(app){
    var orm_account = app.database.db0.account;

    return function(body){
        return Q(body)
        .then(validateAccount.validateSignup)
        .then(()=>{
            return orm_account.findOne(null, {email: body.email})
            .then(user=>{
                console.log('found', user);
                if(user){
                    throw {message: 'That email is already used.'};
                }
                else{
                    var doc = _.pick(body, 'name', 'email');
                    doc.password = body.password;
                    
                    return orm_account.createAndGet(doc);
                }
            })
        })
    }
}