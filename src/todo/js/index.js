const express = require("express");
const path = require("path");

//------------
//- Servidor -
//------------
const PORT = 3000;
const app = express();

app.listen(PORT, () => {
  console.log(`Running this app on the port ${PORT}`);
});

//pruebas aca

var prueba = require('./sesiones');
let vacio;
let session_toc;

async function run() {
  try{
    return await prueba.session(vacio)
  } catch(error){
    return error;
  }
};

//---------
//- Rutas -
//---------

app.get("/camaras", (req,res) => {
  session_toc = run().then(result =>{
    console.log(result)
    session_toc = result;
  }).then(
    res.sendFile(path.resolve(__dirname,"../camaras.html"),{
      dato: session_toc
    }));
});

app.get("/liveness", (req,res) => {
  session_toc = run().then(result =>{
    console.log(result)
    session_toc = result;
  }).then(
    res.sendFile(path.resolve(__dirname,"../liveness.html"),{
      dato: session_toc
    }));
});

