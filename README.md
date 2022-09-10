# zulu-cashback
This is my project for Zulu Hackathon web3. 

Zulu Cashback is an API which allow e-commerces to send cashback in cryptocurrencies to their users.

The cashback will be given in any of the available Zulu stablecoins: ZMXN (Zulu Mexican Peso), ZGTQ (Zulu Guatemalan Quetzal), ZCOP (Zulu Colombian Peso), ZDOP (Zulu Dominican Peso) and ZHNL (Zulu Honduran Lempira).

Database:

- The database is Airtable. The Airtable API Key is expected as an env variable as AIRTABLE_API_KEY. The value should be requested to csacanam@gmail.com because the database should have the same structure.
- In this database there are 3 tables: Commerce, ApiKey and Reward.
- Commerce: this table is where e-commerces are registered. At this time each e-commerce have 2 properties: name and status.
- ApiKey: this table is where e-commerce api keys are stored. Each ApiKey have the id (the api key itself), percentage fee, currency, status (active or inactive) and the relationships between Commerce and Reward tables.
- Reward: this is the table where each cashback is stored. Each reward have the id, user email, currency, total purchase, reward and status (pending or approved.

API:

- The API was built on NodeJS/Express.
- There is only on web service available.
- The web service is POST and it is located at the root (localhost:8080).
- 4 parameters in the body are expected by the web service: apiKey, userEmail, amountPurchase and currency.
- The apiKey should be created and active in Airtable. The same for the e-commerce associated to the api key.

How to run the project?

- Create the .env file to the cloned project.
- Add SENDGRID_API_KEY and AIRTABLE_API_KEY. AIRTABLE_API_KEY should be requested to csacanam@gmail.com. SENDGRID_API_KEY could be any valid SendGrid API Key.
- Run npm install
- Run node app/server.js
- Open postman and send a POST request to localhost:8080 with the next parameters in the body: apiKey (a valid one), userEmail, amountPurchase and currency.

If everything is working a new record should be added to Rewards table and an email should be send to user email.






