
const FormData = require('form-data');
const data = new FormData();

module.exports.session = async function(msg) { 

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
      console.log(response.data);
      msg = response.data.session_id; 
    }).catch(function (error) {
      console.log(error);
    });
  return msg;
};