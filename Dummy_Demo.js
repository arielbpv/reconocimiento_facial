const express = require("express");
const path = require("path");
const axios = require('axios');

const PORT = 3000;
const app = express();

app.listen(PORT, () => {
  console.log(`Running this app on the port ${PORT}`);
});

// Motor de plantilla
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


async function session(msg) { 
    const FormData = require('form-data');
    const data = new FormData();

    data.append('apiKey', 'c2e473583ef94222ab2298b4aa66ec18');
    data.append('autocapture', 'true');
        
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

async function run() {
    let vacio; 
    try{
      return await session(vacio)
    } catch(error){
      return error;
    }
};
//-----------------------------------
//- llamando camara documento front -
//-----------------------------------
// TOCautocapture('container', {
//     locale: "es",
//     session_id: "igresar session key",
//     document_type: "CHL2",
//     document_side: "front", //cara del documento
//     http: "true",
//     callback: function(captured_token, image){ alert(token); },
//     failure: function(error){ alert(error); }
// });

//----------------------------------
//- llamando camara documento back -
//----------------------------------
// TOCautocapture('container', {
//     locale: "es",
//     session_id: "igresar session key",
//     document_type: "CHL2",
//     document_side: "back", //cara del documento
//     http: "true",
//     callback: function(captured_token, image){ alert(token); },
//     failure: function(error){ alert(error); }
// });

//------------------------------------
//- llamando camara documento selfie -
//------------------------------------ 
// TOCliveness('liveness', {  
//     locale: "es",  
//     session_id: "igresar session key",
//     http: "true",  
//     callback: function(token){ alert(token); },  
//     failure: function(error){ alert(error); }  
// });

function Main(){

    //------------------------------
    //- obteniendo keys de session -
    //------------------------------

    //session key front
    run().then(result =>{
        session_keyFront = result;
        let backEnd_Var;
        console.log("session KEY front: " + session_keyFront);
        app.get("/camaraF", (req, res) => {
            res.render('camaraFront', {datos: session_keyFront, backEnd_Var});
        });
        
        run().then(result =>{
            session_keyBack = result;
            console.log("session KEY back: " + session_keyBack);
            run().then(result =>{
                session_keySelfie = result;
                console.log("session KEY selfie: " + session_keySelfie);
            });
        });
    });
};

Main();