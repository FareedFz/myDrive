const client = require('../UserClient')
const users = {
    Register:function(req,res){
        client.Register({
            email:req.body.email,
            password:req.body.password,
            name:req.body.name
          }, (error, response) => {
            if (error) throw error;
            res.send("register");

          });
          
    },
    Login:function(req,res){

        client.Login({
              email:req.body.email,
              password:req.body.password,
            }, (error, response) => {
                if (error) throw error;
                console.log(response)
                res.send("login");
    
              });

    },
    createFolder:function(req,res){
        
      client.Login({ //login adn create folder we call same function 
            email:req.body.email,
            password:req.body.password,
            fileType:req.body.type,
            folderName:req.body.folderName
          }, (error, response) => {
              if (error) throw error;
              
              res.send("folder creation");
  
            });

    },
    createFile:function(req,res){
      console.log(req)
      client.Login({ //login adn create folder we call same function 
            email:req.body.email,
            password:req.body.password,
            fileType:req.body.type,
            folderName:req.body.folderName
          }, (error, response) => {
              if (error) throw error;
              
              res.send("folder creation");
  
            });
    }
}
module.exports=users;