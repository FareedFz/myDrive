const bcrypt = require('bcryptjs');
const saltIteration  = 10;
var hashing = {

     hash_generate : async function(password){
         
        let saltGenerate = bcrypt.genSaltSync(saltIteration);
        let hashPasword  = await bcrypt.hash(password, saltGenerate);
        return hashPasword;

    },

    hashValidator : async function(password,hash){
  
        let isPasswordValid = await bcrypt.compare(password, hash);
    
        return isPasswordValid;


    }   
}
module.exports = hashing;

//console.log(a)