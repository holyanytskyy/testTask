const fs = require('fs');
const jszip = require('jszip');
const csvjson = require('csvjson');
const moment = require('moment');

fs.readFile('Carrier_Integration_-_Data (3).zip', function(err, data) {
    if (err) throw err
    let zip = new jszip();
    zip.loadAsync(data).then(function(contents) {
        Object.keys(contents.files).forEach(function(filename) {
            zip.file(filename).async('nodebuffer').then(function(content) {
                fs.writeFileSync(filename, content);
                let readData = fs.readFileSync(filename,'utf8');
                options = {
                    delimiter: '||',
                    quote: true
                };
                let data = csvjson.toObject(readData,options);
                const outputData = data.map(user =>{
                    return {
                        name: user.name,
                        phone: user.phone.replace(/\D+/gm, ''),
                        person: {
                          firstName: user.first_name,
                          lastName: user.last_name,
                        },
                        amount: +user.amount,
                        date: moment(user.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        costCenterNum: user.cc.replace(/[a-zA-Z]+/g,''),
                    };
                });
                const info = JSON.stringify(outputData);
                fs.writeFileSync('output.json', info);     
            });   
       });
    });
});
