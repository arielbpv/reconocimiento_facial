const express = require("express");
const path = require("path");
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

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


// ==============================
// match entre documento y selfie
// ==============================
async function match(front_token,back_token,liveness_token){
    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();
    data.append('id_front', front_token);
    data.append('id_back', back_token);
    data.append('selfie', liveness_token);
    data.append('apiKey', 'c2e473583ef94222ab2298b4aa66ec18');
    data.append('documentType', 'CHL2');

    var config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://sandbox-api.7oc.cl/v2/face-and-document',
    headers: { 
        ...data.getHeaders()
    },
    data : data
    };

    axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });
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
                app.get('/Match', function(req, res) {
                    var front_token = req.query.captured_tokenF;
                    var back_token = req.query.captured_tokenB;
                    var liveness_token = req.query.captured_tokenS;
                    console.log("----------------------- \n" + "tokenFront: " + front_token + "\n" + "tokenBack: " + back_token + "\n" + "tokenSelfie: " + liveness_token);
                    match(front_token,back_token,liveness_token);

                  });
            });
        });
    });
};

Main();