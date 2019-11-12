const sslCertificate = require('check-cert-expiration');
const express = require('express');

const app = express();

const storage = require('azure-storage');
const dotenv = require('dotenv');

dotenv.config({ path: '../server.env' });

var jsonResult = [];
const storageClient = storage.createTableService(process.env['ACCESS_KEY'], process.env['STORAGENAME']);

storageClient.createTableIfNotExists("urls", (err, result) => {
    if (err) throw err;
    console.log(result);
})

app.listen(process.env.PORT, err => {
    if (err) {
        return console.log(err);
    }
    return console.log(`server is listening on: ${process.env.PORT}!`);
})


app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Credentials", true)
    res.send('Cookies: ' + JSON.stringify(req.cookies));
})


app.get('/checkCerts', function (req, res) {
    var array = [];
    res.setHeader('Access-Control-Allow-Origin', '*');
    var query = new storage.TableQuery().select('PartitionKey, RowKey')
    storageClient.queryEntities('urls', query, null, { payloadFormat: "application/json;odata=nometadata" }, function (err, resu, resp) {
        array = resu.entries;
        for (var i = 0; i < array.length; i++) {
            if (!jsonResult.length > !array.length) {
                sslCertificate(resu.entries[i].RowKey._, function (err, result) {
                    if (!err) {
                        var jsonEntries = {
                            name: result.host,
                            port: result.port,
                            valid: true,
                            dayleft: result.daysLeft,
                            valid_to: result.valid_to
                        }
                        jsonResult.push(jsonEntries);
                    } else {
                        var jsonFailed = {
                            name: result.host,
                            port: result.port,
                            valid: false,
                            dayleft: '0',
                            valid_to: '0'
                        }
                        jsonResult.push(jsonFailed);
                    }
                })
            }
        }
        jsonResult.sort(function(a, b){
            return a.dayleft - b.dayleft;
        })
        res.send(jsonResult);
    })
})

app.get('/resetCerts', function(req, res) {
    jsonResult = [];
    console.log('Certificates reset at: '+ new Date().toUTCString());
    res.redirect('http://localhost:3000');
})