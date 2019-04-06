const fs = require('fs');
var Promise = require('bluebird');
// var fs = Promise.promisifyAll(require('fs'));

function downloadRemoteData(netBoxInfo,callback){    
    // var Client = require('C:/Users/schoudhury/AppData/Roaming/npm/node_modules/ssh2-sftp-client');
    var Client = require('ssh2-sftp-client');
    var sftp = new Client();
    console.log("Before Download: "+netBoxInfo.netBoxSerialNumber);
    
    sftp.connect({
        host:'xl2gateway.nti-audio.com',
        port: '22',
        username: netBoxInfo.netBoxSerialNumber,
        password: 'Austria'
    }).then(() => {
        // sftp.get(netBoxInfo.netBoxDataFile,destinationPath);
        // var lineArray = sftp.get(netBoxInfo.netBoxDataFile).toString().split('\n'); 
        return sftp.get(netBoxInfo.netBoxDataFile);
    }).then((value)=>{
        var lineArray = value.toString().split('\n');
        var x = [];
        var y = [];
        for (var j = 24;j<lineArray.length-2;j++){
            x[j-24]  = '"'+ lineArray[j].split('\t')[1].replace(/\s+/g,'') + ' ' + lineArray[j].split('\t')[2].replace(/\s+/g,'')+'"';
            // x[j-24]  = lineArray[j].split('\t')[1].replace(/\s+/g,'')+ " " + lineArray[j].split('\t')[2].replace(/\s+/g,'');
            y[j-24]  = parseFloat(lineArray[j].split('\t')[11]);
        }
        data = {};
        
        data.name = netBoxInfo.name;
        data.netBoxSerialNumber = netBoxInfo.netBoxSerialNumber;
        data.data_x = x;
        data.data_y = y;
        data.lat=netBoxInfo.lat;
        data.long=netBoxInfo.long;
        data.flag = 1;
        callback(undefined,data);
    }).catch((err)=>{
        console.log("reached here with "+netBoxInfo.netBoxSerialNumber);
        data = {};
        
        data.name = netBoxInfo.name;
        data.netBoxSerialNumber = netBoxInfo.netBoxSerialNumber;
        data.data_x = [];
        data.data_y = [];
        data.lat=netBoxInfo.lat;
        data.long=netBoxInfo.long;
        data.flag = 0;
        callback(data,undefined);    
    });
}


/////// Reading contents of text file
function getData(netBoxInfo){  
    var promises = [];
    var downloadRemoteDataPromised = Promise.promisify(downloadRemoteData);
    
    for (var i = 0; i < netBoxInfo.length; i++){
        promises.push(downloadRemoteDataPromised(netBoxInfo[i]).then((data)=>{
            return data;
        }).catch((data)=>{
            return data;
        }));
    }
    console.log(promises.length);
    return Promise.all(promises);
    // return Promise.all(promises);
}

  module.exports = {getData} 



// function downloadRemoteData(netBoxInfo, destinationPath,index,callback){    
//     // var Client = require('C:/Users/schoudhury/AppData/Roaming/npm/node_modules/ssh2-sftp-client');
//     var Client = require('ssh2-sftp-client');
//     var sftp = new Client();
//     console.log("Before Download: "+netBoxInfo.netBoxSerialNumber);
    
//     sftp.connect({
//         host:'xl2gateway.nti-audio.com',
//         port: '22',
//         username: netBoxInfo.netBoxSerialNumber,
//         password: 'Austria'
//     }).then(() => {
//         sftp.get(netBoxInfo.netBoxDataFile,destinationPath);
//         // var lineArray = sftp.get(netBoxInfo.netBoxDataFile).toString().split('\n'); 
//         // sftp.get(netBoxInfo.netBoxDataFile);
//     }).then(()=>{
//         setTimeout(() => {
//             // var readFileAsync = Promise.promisify(fs.readFile);
//             console.log("Read path:"+destinationPath);
//             // readFileAsync(destinationPath).then((value)=>{
//             // var lineArray = value.toString().split('\n');
//             var lineArray = fs.readFileSync(destinationPath).toString().split('\n');
//             // var lineArray = value.toString().split('\n'); 
//             // console.log(lineArray);
//             //console.log("lineArray: \n" +lineArray);
//             var x = [];
//             var y = [];
//             for (var j = 24;j<lineArray.length-2;j++){
//                 x[j-24]  = '"'+ lineArray[j].split('\t')[1].replace(/\s+/g,'') + ' ' + lineArray[j].split('\t')[2].replace(/\s+/g,'')+'"';
//                 // x[j-24]  = lineArray[j].split('\t')[1].replace(/\s+/g,'')+ " " + lineArray[j].split('\t')[2].replace(/\s+/g,'');
//                 y[j-24]  = parseFloat(lineArray[j].split('\t')[11]);
//             }
//             data = {};
            
//             data.name = netBoxInfo.name;
//             data.netBoxSerialNumber = netBoxInfo.netBoxSerialNumber;
//             data.data_x = x;
//             data.data_y = y;
//             callback(undefined,data);
//         // });    
//         }, 5000);
        
//     });
// }




  // function downloadRemoteData(netBoxSerialNumber, netBoxDataFile, destinationPath,callback){    
//     // var Client = require('C:/Users/schoudhury/AppData/Roaming/npm/node_modules/ssh2-sftp-client');
//     var Client = require('ssh2-sftp-client');
//     var sftp = new Client();
//     console.log("Before Download: "+netBoxSerialNumber);
    
//     sftp.connect({
//         host:'xl2gateway.nti-audio.com',
//         port: '22',
//         username: netBoxSerialNumber,
//         password: 'Austria'
//     }).then(() => {
//         sftp.get(netBoxDataFile,destinationPath);
//     }).then(()=>{
//         console.log(callback());
//         callback();
//     });
// }


// function getGraphDataFromFile(index){
//     var destinationPath = "C:/Users/schoudhury/Patching Associates/IPP-19-001 CSS Improvement Part Deux - Documents/General/Analysis/ML Analysis/output" + index.toString() +".txt";
//     return fs.readFileAsync(destinationPath);
// }

// function getData(netBoxInfo){
//     console.log(netBoxInfo);
//     var promise =[];
//     var doThisPr = Promise.promisify(doThis);
//     console.log(doThisPr);
//     promise.push(doThisPr(netBoxInfo).then((data)=>{
//         return data;
//     }));
//     return Promise.all(promise);
// }

// function doThis(netboxInfo, callback){
//     setTimeout(() => {
//         callback(undefined,netboxInfo);
//     }, 2000);
// }