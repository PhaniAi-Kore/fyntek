var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');

// grab the url model


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




app.post('/webhook', function (req, res) {
    var body = req.body;
    var action = (body.result.action);
    console.log(body);

    if (action === 'getaccountdetails' && body.result.actionIncomplete === false)
    {
        var request = require("request");

        var options = {
            method: 'POST',
            url: 'http://52.172.213.166:8080/sbi/Account_List/api/EnqBancsAccountsList/',
            headers:
                    {'postman-token': '2f62145f-9dea-cfb4-1b28-253d5f096ab7',
                        'cache-control': 'no-cache',
                        apikey: 'ywr4rQdbjSOVDtr',
                        'content-type': 'application/json'},
            body: {AccountNumber: body.result.parameters.AccountNumber},
            json: true};

        request(options, function (error, response, body) {
            console.log(body)
            if (error)
                throw new Error(error);
            var json = {
                "speech": "Welcome!" + body.main_ac.CIFname + ",\nYour PFid is " + body.main_ac.PFId,
                "displayText": "Barack Hussein Obama II is the 44th and current President of the United States, and the first African American to hold the office. Born in Honolulu, Hawaii, Obama is a graduate of Columbia University   and Harvard Law School, where ",
                "source": "DuckDuckGo"
            };
            res.set("Content-type", "application/json")
            res.send(json);
        });

        //console.log(body);



    } else if (action === 'ministatement' && body.result.actionIncomplete === false)
    {
        var request = require("request");

        var options = {
            method: 'POST',
            url: 'http://52.172.213.166:8080/sbi/Mini/api/EnqMiniStatement',
            headers:
                    {
                        'cache-control': 'no-cache',
                        apikey: 'ywr4rQdbjSOVDtr',
                        'content-type': 'application/json'
                    },
            body: {AccountNumber: "00000030001512992"},
            json: true
        };
        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);
            console.log(body);
            var speech = "Sure, Your current balance is " + body.CurrentBalance + ". Here is your last 5 transactions  :";
            for (var i = 0; i < body.StatementInfo.length; i++)
            {
                speech = speech + "\n\
" + (i + 1) + ". " + body.StatementInfo[i].Amount + " " + body.StatementInfo[i].TransactionDate + " " + body.StatementInfo[i].TransactionType + "\n";
            }
            var json = {
                "speech": speech,
                "displayText": "Barack Hussein Obama II is the 44th and current President of the United States, and the first African American to hold the office. Born in Honolulu, Hawaii, Obama is a graduate of Columbia University   and Harvard Law School, where ",
                "source": "DuckDuckGo"
            };
            res.set("Content-type", "application/json");
            res.send(json);
        });
        //console.log(body);
    } 
    else if (action === 'accntstatement' && body.result.actionIncomplete === false)
    {
        var request = require("request");
        var Period = body.result.parameters.Period;
        Period = Period.split("/");
        var options = {
            method: 'POST',
            url: 'http://52.172.213.166:8080/sbi/Detail/api/EnqINBAccountStatement',
            headers:
                    {
                        'cache-control': 'no-cache',
                        apikey: 'ywr4rQdbjSOVDtr',
                        'content-type': 'application/json'
                    },
            body: {
                "AccountNumber": "30001512992", 
                "FromAmount": body.result.parameters.FromAount, 
                "FromDate": "0", 
                "ToAmount": body.result.parameters.ToAmount, 
                "ToDate": "0", "TransactionNumber": "150"
            },
            json: true
        };
        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);
            console.log(body);
            var speech = "Sure, Your account  balance is " + body.CurrentBalance + ". Here is your last 5 transactions  :";
            for (var i = 0; i < body.StatementInfo.length; i++)
            {
                speech = speech + "\n\
" + (i + 1) + ". " + body.StatementInfo[i].Amount + " " + body.StatementInfo[i].TransactionDate + " " + body.StatementInfo[i].TransactionType + "\n";
            }
            var json = {
                "speech": speech,
                "displayText": "Barack Hussein Obama II is the 44th and current President of the United States, and the first African American to hold the office. Born in Honolulu, Hawaii, Obama is a graduate of Columbia University   and Harvard Law School, where ",
                "source": "DuckDuckGo"
            };
            res.set("Content-type", "application/json");
            res.send(json);
        });
        //console.log(body);
    }
    else
    {
        var json = {
            "speech": body.result.fulfillment.speech,
            "displayText": "Barack Hussein Obama II is the 44th and current President of the United States, and the first African American to hold the office. Born in Honolulu, Hawaii, Obama is a graduate of Columbia University   and Harvard Law School, where ",
            "source": "DuckDuckGo"
        };
        res.set("Content-type", "application/json")
        res.send(json);
    }

});

var server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
