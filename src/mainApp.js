/////// Main Nodejs File
////// Author: Samiul Choudhury @2019

//// Import Packages and Local function libraries
var http = require('http');
const path = require('path');
const express = require('express');

const dataDownload = require('./dataDownload.js');
var port = process.env.PORT || 8080;

/// Global variables
// var netBoxInfo = [{
//   netBoxSerialNumber: 'CDZNZ-7PPUV',
//   name: 'Facility Fenceline Monitor',
//   netBoxDataFile: '/NetBox/XL2/Projects/.Unsaved/SLM/_123_Rpt_Report.txt'
// },{
//   netBoxSerialNumber: 'DCL74-UXUPM',
//   name: 'Residence Monitor',
//   netBoxDataFile: '/NetBox/XL2/Projects/.Unsaved/SLM/_123_Rpt_Report.txt'
// }];

var netBoxInfo = [{
  netBoxSerialNumber: 'DCL74-UXUPM',
  name: 'Facility Fenceline Monitor',
  netBoxDataFile: '/NetBox/XL2/Projects/.Unsaved/SLM/_123_Rpt_Report.txt'
},{
  netBoxSerialNumber: 'CDZNZ-7PPUV',
  name: 'Residence R23A Monitor',
  netBoxDataFile: '/NetBox/XL2/Projects/.Unsaved/SLM/_123_Rpt_Report.txt'
},{
  netBoxSerialNumber: 'ZXFER-XFDCV',
  name: 'Residence R24A Monitor',
  netBoxDataFile: '/NetBox/XL2/Projects/.Unsaved/SLM/_123_Rpt_Report.txt'
}];


///// Creating and running server
const mainApp = express(); // Create express server instance

const publicDirPath = path.join(__dirname, '../public'); // Setting up static root directory for HTML

mainApp.set('view engine','hbs');
mainApp.use(express.static(publicDirPath));

//// Route Handler
mainApp.get('',(req,res)=>{
  dataDownload.getData(netBoxInfo).then((dataArray)=>{
    // console.log("DataArray:");
    // console.log(dataArray);
    htmlData = {};
    htmlData.data = dataArray;
    res.render('index',htmlData);
          //       // setTimeout(() => {
          //         var lineArray = fs.readFileSync(destinationPath).toString().split('\n');
          //         console.log("lineArray: \n" +lineArray);
          //         x = [];
          //         y = [];
          //         for (var j = 24;j<lineArray.length-2;j++){
          //             x[j-24]  = '"'+ lineArray[j].split('\t')[1].replace(/\s+/g,'') + ' ' + lineArray[j].split('\t')[2].replace(/\s+/g,'')+'"';
          //             // x[j-24]  = lineArray[j].split('\t')[1].replace(/\s+/g,'')+ " " + lineArray[j].split('\t')[2].replace(/\s+/g,'');
          //             y[j-24]  = parseFloat(lineArray[j].split('\t')[11]);
          //         }
          //         data[i] = {};
                  
          //         // data[i].name = netBoxInfo[i].name;
          //         // data[i].netBoxSerialNumber = netBoxInfo[i].netBoxSerialNumber;
          //         data[i].data_x = x;
          //         data[i].data_y = y;
          //         console.log("x: \n" + x);
          //     });
          // }
      
  });
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
  
});

/// Using only express
mainApp.listen(port, ()=>{
  console.log('Listening on port 8080...');
});

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


