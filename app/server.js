const express = require('express') //llamamos a Express
const bodyParser = require('body-parser')
const Airtable = require('airtable')

require('dotenv').config()

const app = express()           

// create application/json parser
const jsonParser = bodyParser.json()  

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const port = process.env.PORT || 8080  

//SendGrid API
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//Airtable Configuration
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY})
const base = require('airtable').base('appfi0ms3hP66cykY');


app.post('/', urlencodedParser, function(req, res) {
  const apiKey = req.body.apiKey //It is pending to add change this for security
  const userEmail = req.body.userEmail;
  const amountPurchase = req.body.amountPurchase;
  const currency = req.body.currency;
  let reward;


    //Get commerce name from db
    base('ApiKey').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      view: "Grid view",
      filterByFormula: `Id="${apiKey}"`
    }).eachPage(function page(records, fetchNextPage) { 
      if(records && records.length > 0){
        records.forEach(function(record) {
          const apiKeyId = record.id;
          console.log(apiKeyId)
          const commerceName = record.get('CommerceName')[0];
          const commerceStatus = record.get('CommerceStatus')[0];
          const apiKeyStatus = record.get('Status');
          const percentageFee = record.get('Percentage Fee');
          reward = amountPurchase * percentageFee; 

          if(commerceStatus === 'Active'){
            if (apiKeyStatus === 'Active') {

              base('Reward').create([
                {
                  "fields": {
                    "Email": userEmail,
                    "Currency": currency,
                    "Total Purchase": parseFloat(amountPurchase),
                    "Reward": reward,
                    "Status": "Pending",
                    "ApiKey": [apiKeyId]
                  }
                }
              ], function(err, records) {
                if (err) {
                  console.error(err);
                  return;
                }

                if(records && records.length > 0){
                  sendEmailToUser(userEmail, reward, currency, commerceName);
                }

              });


            } else {
              res.statusMessage = "Your API Key is not active. Please send an email to support@zuluapp.io";
              res.status(400).end();
            }

          } else {
            res.statusMessage = "Your commerce is not active. Please send an email to support@zuluapp.io";
            res.status(400).end();
          }


          res.json({ mensaje: '1' })   


        });
      }else {
        res.statusMessage = "API Key is not valid";
        res.status(400).end();
      }


    }, function done(err) {
        if (err) { console.error(err); return; }

    });

})


function sendEmailToUser(userEmail, reward, currency, commerceName){

  //Send email to user
  const msg = {
    to: userEmail, 
    from: 'team@zuluapp.io',
    subject: 'Has recibido ' + reward + ' ' + currency + ' de parte de Zulu :)',
    text: 'Hola, has recibido ' + reward + ' ' + currency  + ' de parte de Zulu por tu reciente compra en ' + commerceName + '. Para visualizar y usar tu saldo, ingresa a https://zuluapp.io', 
    html:'Hola, has recibido ' + reward + ' ' + currency  + ' de parte de Zulu por tu reciente compra en ' + commerceName + '. Para visualizar y usar tu saldo, ingresa a https://zuluapp.io',
  }
  
  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)

    })
    .catch((error) => {
      console.error(error)
    })
}

function createReward (userEmail, currency, totalPurchase, reward){


}

// Init server
app.listen(port)
console.log('API listening on: ' + port)
