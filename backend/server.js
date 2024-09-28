import app from './app.js';
import DataBaseConnection from './Utills/DataBase.js';


const port = process.env.PORT || 8000;

process.on('uncaughtException',(err)=>{
    console.error(err);
    console.log("UNCAUGHT Exception! Shutting down ...");
    process.exit(1);
});




const server = app.listen(port, () => {
    DataBaseConnection();
    console.log(`Server is running on 🚀 http://localhost:${port}🚀 `);
  });

  process.on("unhandledRejection", (err) => {
    console.error(err);
    console.log("UNHANDLED REJECTION! Shutting down ...");
    server.close(() => {
      process.exit(1); // Exit the process after closing the server
    });
  });