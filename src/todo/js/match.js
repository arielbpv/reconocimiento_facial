//--------------------------
//- Consumo api API FACIAL -
//--------------------------
let data = new FormData();
// ------------
// - imagenes -
// ------------

// -----------------------------
// - agregando datos al header -
// -----------------------------
data.append('id_front', tokenimgFront); //imagen delantera del documento
data.append('id_back', tokenimgBack); //imagen trasera del documento
data.append('selfie', tokenimgSelf); //foto del usuario
data.append('apiKey', 'c2e473583ef94222ab2298b4aa66ec18');
data.append('documentType', 'CHL2'); // tipo de documento 

// ---------------------------------------
// - configuracion del consumo de la API -
// ---------------------------------------
let config = {
  method: 'post',
  url: 'https://sandbox-api.7oc.cl/v2/face-and-document',
  headers: { 
    ...data.getHeaders()
  },
  data : data
};

// ---------------------
// - consumo de la API -
// ---------------------
axios(config).then((response) => {
  console.log(JSON.stringify(response.data));
}).catch((error) => {
  console.log(error);
});