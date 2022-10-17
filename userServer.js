const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const connection = require('./Config/database');
const hashing = require('./helpers/hashing');
const fileClient = require('./FileClient');


//path to our proto file
const PROTO_FILE = "./protoFile.proto";

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };
  
  
  const pkgDefs = protoLoader.loadSync(PROTO_FILE, options);
  
  //load Definition into gRPC
  const userProto = grpc.loadPackageDefinition(pkgDefs);
  
  //create gRPC server
  const server = new grpc.Server();
  
  //implement UserService
  server.addService(userProto.UserService.service, {
    //implment GetUser
    Register: (input, callback) => {
      try {
        
        let name  = input.request.name;
        let email = input.request.email;
        let password = input.request.password;
        let emailExists = "select * from users where email = '"+email+"'";
      
        console.log(emailExists);
        connection.query(emailExists,async(err,rows)=>{
            
            if(rows.length){
    
                //res.send("User alreadyExists");
                console.log("mail exist")
                callback(null, password);
  
    
            }
            else{

                let encryptedPassword = await hashing.hash_generate(password);
                    
                let sql = "insert into users (userName,email,password) values('"+name+"','"+email+"','"+encryptedPassword+"')";
                
                connection.query(sql,async(err,rows)=>{
    
                   if(err){    
    
                      console.log(err,sql);
  
                      callback(null, {status:400,msg:"insertion error"});
                        
                    }
                    else{
    
                        callback(null, {status:200,msg:"register success"});
  
    
                    }       
                    
                })
            }
        })

      } catch (error) {
        callback(error, null);
      }
    },
    Login: (input, callback) => {
      try {
       
        let email = input.request.email;
        let password = input.request.password;
        let fileRequestType=input.request.fileType;
        let folderName= input.request.folderName;

        let userQuery = "select * from users where email = '"+email+"'";

        console.log(userQuery,"Logine");

        connection.query(userQuery,async(err,rows)=>{
            
          if(rows.length){

            let storedPassword = rows[0]['password'];
            let isValidpassword = await hashing.hashValidator(password,storedPassword);
 
            if(isValidpassword){

              let userId = rows[0]['id'];
              console.log(rows)
                
                if(fileRequestType){
                  
                  if(fileRequestType == 'folder' && folderName){

                    fileClient.CreateFolder({ //login adn create folder we call same function 
                        userId:userId,
                        folderName:folderName
                    }, 
                    (error, response) => {
                        if (error) throw error;
                        
                        callback(null, {status:200,msg:"Folder Created"});
            
                      });                  }
                }
                callback(null, {status:200,msg:"Login success"});
              }
            else{
                 callback(null, {status:400,msg:"Incorecct pasword"});
            }
             
         }
                    
        })

      } catch (error) {

        callback(error, null);
      }
    }
    
    
  });
  
  
  //start the Server
  server.bindAsync(
    //port to serve on
    "127.0.0.1:5000",
    //authentication settings
    grpc.ServerCredentials.createInsecure(),
    //server start callback 
    (error, port) => {
      console.log(`listening on port ${port}`);
      server.start();
    }
  );
