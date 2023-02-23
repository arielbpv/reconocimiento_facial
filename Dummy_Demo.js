const express = require("express");
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
async function saveSession() {
    let vacio; 
    try{
      return await session(vacio)
    }catch(error){
      return error;
    }
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

    axios(config).then(function (response) {
        console.log(JSON.stringify(response.data));
    }).catch(function (error) {
        console.log(error);
    });
};

// ====
// main
// ====
function Main(){

    //session key front
    saveSession().then(result =>{
        session_keyFront = result;
        
        console.log("-----------------------");
        console.log("- sesion_id obtenidos -");
        console.log("-----------------------");
        console.log("session KEY front: " + session_keyFront);//muestro la key para el anverso del documento
        
        //session key back
        saveSession().then(result =>{
            session_keyBack = result;
            console.log("session KEY back: " + session_keyBack);//muestro la key para el reverso del documento
            
            //session key selfie
            saveSession().then(result =>{
                session_keySelfie = result;
                console.log("session KEY liveness: " + session_keySelfie);//muestro la key para el liveness
                
                //Render TOCautocapture
                app.get("/camaras", (req, res) => {
                    res.render('camaras', {
                        front: session_keyFront,
                        back: session_keyBack,
                        selfie: session_keySelfie
                    });
                });
                
                app.get('/Match', function(req, res) {
                    let front_token = req.query.captured_tokenF;
                    let back_token = req.query.captured_tokenB;
                    let liveness_token = req.query.captured_tokenS;

                    console.log("-----------------------");
                    console.log("- Tokens de obtenidos -");
                    console.log("-----------------------");
                    console.log("tokenFront: " + front_token + "\n" + "tokenBack: " + back_token + "\n" + "tokenSelfie: " + liveness_token);
                    
                    console.log("---------------------------------");
                    console.log("- Resultado de Match biometrico -");
                    console.log("---------------------------------");
                    match(front_token,back_token,liveness_token);

                  });
            });
        });
    });
};

Main();