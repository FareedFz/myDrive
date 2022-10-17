const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const connection = require('./Config/database');
const currentWorkingDirectory = process.cwd();
const commonFns= require('./commonFns')
const storagePath = currentWorkingDirectory + '/FileStorage/';
const fs = require('fs');




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
 
    CreateFolder:(call,callback)=>{

      try{

        let folder  = call.request.folderName;
        let userId  = call.request.userId;
        let userCommonFolderPath=storagePath+userId;
        let folderPath = userCommonFolderPath+'/'+folder

        commonFns.checkApiTraceDir(userCommonFolderPath); // for creating seperate folder for user

        commonFns.checkApiTraceDir(folderPath);

        let sql = "insert into files (userId,folderPath,files) values('"+userId+"','"+folderPath+"','')";

        connection.query(sql,async(err,rows)=>{

          if(err) throw err;
                    
        })
        

      }
      catch(err){
        callback(error, null);
      }
    },
    uploadFile : (call, callback) => {
      
      let folder  = call.request.folderName;
      let userId  = call.request.userId;
      let userCommonFolderPath=storagePath+userId;
      let folderPath = userCommonFolderPath+'/'+folder;
      let filename   = call.request.filename;
      let filePath = '';
      if(folder&&filename){
          filePath = folderPath+'/'+filename;
      }
      
      // handle incoming data stream
      call.on('data', async (payload) => {
  
      });
  // on stream end send final response to the client with required details
      call.on('end', async () => {
          callback(null, {
              'id': uuid.v4(),
              'name': name
          });
      });
    }

    
  });
  
  
  //start the Server
  server.bindAsync(
    //port to serve on
    "127.0.0.1:5200",
    //authentication settings
    grpc.ServerCredentials.createInsecure(),
    //server start callback 
    (error, port) => {
      console.log(`listening on port ${port}`);
      server.start();
    }
  );
