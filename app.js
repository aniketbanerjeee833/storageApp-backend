import express from "express"; 
import cors from "cors"; 
import cookieParser from "cookie-parser"; 
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js"; 
import subscriptionRoutes from "./routes/subscriptionRoutes.js"; 
import { spawn } from 'child_process';
import crypto from 'crypto';
import userRoutes from "./routes/userRoutes.js";
// import webhookRoutes from "./routes/webhookRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

import checkAuth from "./middlewares/authMiddleware.js";
import { connectDB } from "./config/db.js";

await connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );
const allowedOrigins = [
  process.env.CLIENT_URL_1,
  process.env.CLIENT_URL_2
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 ||!origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.post("/github-webhook", (req, res) => {

  const givenSignature=req.headers['x-hub-signature-256'];
console.log(givenSignature); 
 if(!givenSignature){
    return res.status(401).json({error:"Invalid Signature"});
  }
  
  const calculatedSignature="sha256="+crypto.
  createHmac('sha256',
    "aniket123").
    update(JSON.stringify(req.body)).digest('hex');
console.log(calculatedSignature)
if(givenSignature!==calculatedSignature){
 return res.status(401).json({error:"Unauthorized"});
 
}
// console.log(req.body);
  res.json({message:"OK"});
let repository;
if(req.body.repository.name==="storageApp-frontend"){
  repository="frontend";
}else{
  repository="backend";
}
console.log(repository);
const bashChildProcess = spawn('bash', [`/home/ubuntu/deploy-${repository}.sh`]);


bashChildProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    process.stdout.write(data);
});
bashChildProcess.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    process.stderr.write(data);
});
bashChildProcess.on('close', (code) => {

    if(code==0){
        console.log(`child process exited with code ${code}`);
      
    }else{
       console.log(`child process exited with code ${code}`);
    }
});
bashChildProcess.on('error', (error) => {
    console.log(`error: ${error.message}`);
})
});
app.get("/", (req, res) => {
  res.json("Hello My Storage World!");
})
app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", checkAuth, fileRoutes);
app.use("/subscriptions", checkAuth, subscriptionRoutes);
// app.use("/webhooks", webhookRoutes);
app.use("/", userRoutes);
// app.use("/auth", authRoutes);

//app.use((err, req, res, next) => {
  //console.log(err);
  // res.status(err.status || 500).json({ error: "Something went wrong!" });
  //res.json(err);
//});
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: err.message || "Something went wrong"
  });
});
app.listen(PORT, () => {
  console.log(`Server Started correctly`);
});

// https://stackoverflow.com/questions/18367824/how-to-cancel-http-upload-from-data-events
