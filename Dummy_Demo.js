const express = require("express");
const path = require("path");
const axios = require('axios');

// =============
// configuracion
// =============
const PORT = 3000;
const app = express();

app.listen(PORT, () => {
  console.log(`Running this app on the port ${PORT}`);
});

// Motor de plantilla
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());


// =================
// obtener sessiones
// =================
async function session(msg) { 
    const FormData = require('form-data');
    const data = new FormData();

    data.append('apiKey', 'c2e473583ef94222ab2298b4aa66ec18');
    data.append('autocapture', 'true');
    data.append('liveness', 'true');
        
    var config = {
        method: 'post',
        url: 'https://sandbox-api.7oc.cl/session-manager/v1/session-id',
        headers: { 
            ...data.getHeaders()
        },
        data : data
    };  
    
    await axios(config).then(function (response) {
        //console.log(response.data);
        msg = response.data.session_id; 
    }).catch(function (error) {
        console.log(error);
    });

    return msg;
};

// ========================================
// funcion para guardar la clave de session
// ========================================
async function run() {
    let vacio; 
    try{
      return await session(vacio)
    } catch(error){
      return error;
    }
};

// ====
// main
// ====
function Main(){

    let front_token;
    let back_token;
    let liveness_token;    

    //session key front
    run().then(result =>{
        session_keyFront = result;
        console.log("session KEY front: " + session_keyFront);//muestro la key para el frente del documento
        run().then(result =>{
            session_keyBack = result;
            console.log("session KEY back: " + session_keyBack);//muestro la key para el reverso del documento
            run().then(result =>{
                session_keySelfie = result;
                console.log("session KEY liveness: " + session_keySelfie);//muestro la key para el liveness
                //peticion get a doccumento frente
                app.get("/camaraF", (req, res) => {
                    res.render('camaraFront', {
                        front: session_keyFront,
                        back: session_keyBack,
                        selfie: session_keySelfie
                    });
                });
                //peticion get a doccumento reverso
                app.get("/camaraB", (req, res) => {
                    res.render('camaraBack', {
                        datos: session_keyBack,
                    });
                    var token_CFront = document.querySelector("h1").textContent;
                    console.log(token_CFront);
                });
                //peticion get a liveness
                app.get("/camaraS", (req, res) => {
                    res.render('liveness', {
                        datos: session_keySelfie,
                    });
                });
            });
        });
    });
};

Main();