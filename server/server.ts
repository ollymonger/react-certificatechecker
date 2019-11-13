const sslCertificate = require('check-cert-expiration');
const express = require('express');

const app = express();

const storage = require('azure-storage');
const dotenv = require('dotenv');

dotenv.config({ path: './server.env' });

var jsonResult = [];
var lastRefreshed = [];
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


app.get('/lastRefreshed', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(lastRefreshed);
})


app.get('/getManualChecks', function(req, res) {
    var query = new storage.TableQuery().top(100).where('PartitionKey eq ?', 'ManualUrl') //ROWKEY MUST EQUAL MANUAL
    storageClient.queryEntities('urls', query, null, { payloadFormat: "application/json;odata=nometadata" }, function (err, resu, resp) {
        if(!err) {
            var manualChecks = resu.entries;
            var jsonResult = [];

            for(var i = 0; i < manualChecks.length; i++) {
                var jsonEntries = {
                    name: resu.entries[i].Url._,
                    valid: resu.entries[i].Valid._,
                    valid_to: resu.entries[i].Valid_to._,
                    description: resu.entries[i].Desc._
                }
                jsonResult.push(jsonEntries);
            }
            res.send(jsonResult)
        } else {
            console.error(err);
            res.send("Invalid request")
        }
    })}
)

app.get('/getManualChecks', function(req, res) {
    var query = new storage.TableQuery().select('RowKey eq ?', 'ManualCheck') //ROWKEY MUST EQUAL MANUAL
    storageClient.queryEntities('urls', query, null, { payloadFormat: "application/json;odata=nometadata" }, function (err, resu, resp) {
        if(!err) {
            var manualChecks = resu.entries;
            var jsonResult = [];

            for(var i = 0; i < manualChecks.length; i++) {
                var jsonEntries = {
                    name: resu.entries[i].Url._,
                    valid: resu.entries[i].Valid._,
                    valid_to: resu.entries[i].Valid_to._,
                    description: resu.entries[i].Desc._
                }
                jsonResult.push(jsonEntries);
            }
        } else {
            console.error(err);
            res.send("Invalid request")
        }
    })}
)

app.get('/checkCerts', function (req, res) {
    var array = [];
    res.setHeader('Access-Control-Allow-Origin', '*');
    var query = new storage.TableQuery().select('PartitionKey, RowKey, Url')
    storageClient.queryEntities('urls', query, null, { payloadFormat: "application/json;odata=nometadata" }, function (err, resu, resp) {
        array = resu.entries;
        for (var i = 0; i < array.length; i++) {
            if (!jsonResult.length > !array.length) {
                if (resu.entries[i].Url._.toString().includes("https://" || "http://" || "/")) {
                    var entry = resu.entries[i].Url._.replace("https://" || "http://" || "/", "");
                    sslCertificate(entry, function (err, result) {
                        if (!err) {
                            console.log(result)
                            var jsonEntries = {
                                name: result.host,
                                port: result.port,
                                valid: true,
                                dayleft: result.daysLeft,
                                valid_to: result.valid_to
                            }
                            jsonResult.push(jsonEntries);
                        } else {
                            console.log(err)
                        }
                    })
                } else {
                    sslCertificate(resu.entries[i].Url._, function (err, result) {
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
                            console.log(err)
                        }
                    })
                }
            }
        }
        jsonResult.sort(function (a, b) {
            return a.dayleft - b.dayleft;
        })
        if (lastRefreshed.length == 0) {
            lastRefreshed.push(new Date().toUTCString());
        }
        res.send(jsonResult);
    })
})

app.get('/resetCerts', function (req, res) {
    jsonResult = [];
    lastRefreshed = [];
    lastRefreshed.push(new Date().toUTCString());
    console.log('Certificates reset at: ' + new Date().toUTCString());
    res.redirect('http://localhost:3000');
})