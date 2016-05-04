const email_regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

exports['validateSignin'] = function(data){
    console.log('validateSignin', data);

    if(data.email.search(email_regex)<0){
        throw {message: 'Invalid email format.'};
    }
    else if(!data.password || data.password.length<8){
    	throw {message: 'Password is too short.'};
    }

    return true;
}

exports['validateSignup'] = function(data){
    console.log('validateSignup', data);

    if(data.email.search(email_regex)<0){
        throw {message: 'Invalid email format.'};
    }
    else if(!data.password || data.password.length<8){
    	throw {message: 'Password is too short.'};
    }
    else if(data.password != data.password2){
        throw {message: "Passwords are not same."};
    }

    return true;
}