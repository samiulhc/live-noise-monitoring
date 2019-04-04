/////// Main Nodejs File
////// Author: Samiul Choudhury @2019

//// Import Packages and Local function libraries
var http = require('http');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const Promise = require('bluebird');

const dataDownload = require('./dataDownload.js');

// Global variables
const port = process.env.PORT || 8080;

const admin = {
  userName: "admin",
  passWord: "paae"
};

const meterInfo =[{
  netBoxSerialNumber:'CDZNZ-7PPUV',
  meterName:'NTI_3'
},{
  netBoxSerialNumber:'DCL74-UXUPM',
  meterName:'NTI_5'
},{
  netBoxSerialNumber:'FSUZA-NXCCM',
  meterName:'NTI_2'
},{
  netBoxSerialNumber:'HHJKH-YXHUR',
  meterName:'NTI_6'
},{
  netBoxSerialNumber:'SJL5S-AXCV9',
  meterName:'NTI_1'
},{
  netBoxSerialNumber:'ZXFER-XFDCV',
  meterName:'NTI_4'
}];

const emptyArr = [{
  name: 'Unknown',
  netBoxSerialNumber: 'Unknown',
  data_x: [],
  data_y: [],
  flag: 0
}];

///// Creating and running server
const mainApp = express(); // Create express server instance
const server = http.Server(mainApp);
var io = require('socket.io')(server);

const publicDirPath = path.join(__dirname, '../public'); // Setting up static root directory for HTML
const viewsDirPath = path.join(__dirname,'../templates/views');
const partialDirPath = path.join(__dirname,'../templates/partials');
const meterInfoBaseFile = path.join(__dirname,'../public/txt/netBoxInfo.json');

mainApp.set('view engine','hbs');
mainApp.set('views',viewsDirPath);
hbs.registerPartials(partialDirPath);

mainApp.use(express.static(publicDirPath));

//// Route Handler
mainApp.get('/',(req,res)=>{
  res.render('index',{});
});

mainApp.get('/graph',(req,res)=>{
  var readFilePromised = Promise.promisify(fs.readFile);
  readFilePromised(meterInfoBaseFile).then((data)=>{
    var netBoxInfoData = JSON.parse(data);
    dataDownload.getData(netBoxInfoData.data).then((dataArray)=>{
      htmlData = {};
      htmlData.data = dataArray;
      res.render('graph',htmlData);
    });
  }).catch((err)=>{
    htmlData = {};
      htmlData.data = emptyArr;
      res.render('graph',htmlData);
  });
});

mainApp.get('/login',(req,res)=>{
  res.render('login',{})
});

mainApp.get('/meters',(req,res)=>{
  meter = {};
  meter.meterInfo=meterInfo;
  res.render('meters',meter);
});

io.on('connection',function(socket){
  socket.on('login',function(data){
    if(data.username === admin.userName && data.password === admin.passWord){
      socket.emit('login_successful','/meters');
    }else{
      socket.emit('login_failed','Invalid Login, please try again');
    }
  });

  socket.on('update_meter_list',function(data){
    netBoxInfo = [];
    var temp={};
    for(var i=0;i<data.sn.length;i++){
      temp={};
      temp.netBoxSerialNumber = data.sn[i];
      temp.name = data.loc[i];
      temp.netBoxDataFile= '/NetBox/XL2/Projects/.Unsaved/SLM/_123_Rpt_Report.txt';
      netBoxInfo.push(temp);
    }
    var writeFilePromised = Promise.promisify(fs.writeFile);
    var dataToWrite = {};
    dataToWrite.data = netBoxInfo;

    writeFilePromised(meterInfoBaseFile,JSON.stringify(dataToWrite)).then(()=>{
      socket.emit('meter_list_update_successful','Meter list has been updated successfully');
      console.log("Data written to File");  
    }).catch((err)=>{
      console.log(err);
      socket.emit('meter_list_update_failed','Could not update meter list. Please try again...');
    });
  });
});


server.listen(port,()=>{
  console.log('Listening on port: '+ port);
});


// /// Using only express
// mainApp.listen(port, ()=>{
//   console.log('Listening on port: '+ port);
// });





////////////////////////////////////////////////////////////////////////////////////////

// mainApp.get('/test',(req,res)=>{
//   var readFilePromised = Promise.promisify(fs.readFile);
//   readFilePromised(meterInfoBaseFile).then((data)=>{
//     var netBoxInfoData = JSON.parse(data);
//     console.log(netBoxInfoData.data);  
//   });
// });


// mainApp.get('/testwrite',(req,res)=>{
//   var writeFilePromised = Promise.promisify(fs.writeFile);
//   dataToWrite = {};
//   dataToWrite.data = netBoxInfo;

//   writeFilePromised(meterInfoBaseFile,JSON.stringify(dataToWrite)).then(()=>{
//     console.log("Data written to File");  
//   }).catch((err)=>{
//     console.log(err);
//   });
// });


// mainApp.get('/graph',(req,res)=>{
//   dataDownload.getData(netBoxInfo).then((dataArray)=>{
//     // console.log("DataArray:");
//     // console.log(dataArray);
//     htmlData = {};
//     htmlData.data = dataArray;
//     res.render('index',htmlData);
//           //       // setTimeout(() => {
//           //         var lineArray = fs.readFileSync(destinationPath).toString().split('\n');
//           //         console.log("lineArray: \n" +lineArray);
//           //         x = [];
//           //         y = [];
//           //         for (var j = 24;j<lineArray.length-2;j++){
//           //             x[j-24]  = '"'+ lineArray[j].split('\t')[1].replace(/\s+/g,'') + ' ' + lineArray[j].split('\t')[2].replace(/\s+/g,'')+'"';
//           //             // x[j-24]  = lineArray[j].split('\t')[1].replace(/\s+/g,'')+ " " + lineArray[j].split('\t')[2].replace(/\s+/g,'');
//           //             y[j-24]  = parseFloat(lineArray[j].split('\t')[11]);
//           //         }
//           //         data[i] = {};
                  
//           //         // data[i].name = netBoxInfo[i].name;
//           //         // data[i].netBoxSerialNumber = netBoxInfo[i].netBoxSerialNumber;
//           //         data[i].data_x = x;
//           //         data[i].data_y = y;
//           //         console.log("x: \n" + x);
//           //     });
//           // }
      
//   });
    // var htmlData = {};
    // htmlData.data = data;
    // console.log(htmlData);
    // res.render('index',htmlData);
  // }); 
  //);
  // htmlData = {};
  // htmlData.data = [
  //   {
  //     netBoxSerialNumber: netBoxSerialNumber,
  //     data_x: [1,2],//data.x,
  //     data_y: [50,70]//data.y
  //   },
  //   {
  //     netBoxSerialNumber: '32434',
  //     data_x: [3,4],//data.x,
  //     data_y: [60,50]//data.y
  //   }
  //   ];
  

  // setTimeout(() => {
    // console.log(htmlData);
    // res.render('index',htmlData);  
  // }, 5000);
  
// });

// //// Using HTTP
// var server = http.createServer(mainApp).listen(8080);






////// Available Netboxes with relative folder paths....
// 'CDZNZ-7PPUV'     /NetBox/XL2/Projects/PENSELIN6-6'
// 'DCL74-UXUPM'
// 'FSUZA-NXCCM'
// 'HHJKH-YXHUR'
// 'SJL5S-AXCV9'
// 'ZXFER-XFDCV'



////// PREV VERSION OF CODE
  
// var server = http.createServer(function (req, res) {
//   var data = getData();
  
//   setTimeout(() => {
//     console.log('request was made: '+ req.url);
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write();
//     return res.end();

//   }, 10000);

//   // var readStr = fs.createReadStream(__dirname+'/liveDataTest2.html','utf8');
//   // readStr.pipe(res);
// //   res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
// //   res.write('<input type="file" name="filetoupload"><br>');
// //   res.write('<input type="submit">');
// //   res.write('</form>');
// //   return res.end();
// });

// server.listen(8080);
