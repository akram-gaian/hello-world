try{


var net = require('net');



var HOST = '192.168.24.190';
var PORT = '3434';
var ReqAuthKey = 'RgBGAEYARgBGAEYARgBGAEYARgBGAEYARgBGAEYARgA=';
var ResAuthKey = 'SwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwA=';
var catcherId = 'CSTB301301003001';
var PACKETHEADERLEN = 256;

var auth = false;

	var args = {};
    args.accumulatingBuffer = new Buffer(0);
    args.totalPacketLen = -1;
    args.accumulatingLen = 0;
    args.recvedThisTimeLen = 0;

var buf1 = new Buffer(1);
buf1.writeUInt8(3, 0);

var buf2 = new Buffer(16);
buf2.write(catcherId);


var buf3 = new Buffer(1);
buf3.writeUInt8(1, 0);

var buf4 = new Buffer(2);
buf4.writeUInt16BE(48, 0);


var buf5 = new Buffer(2);
buf5.writeUInt16BE(67, 0);


var buf6 = new Buffer(2);
buf6.writeUInt16BE(44, 0);


var buf7 = new Buffer(44);
buf7.write(ReqAuthKey);

var finalBuffer = Buffer.concat([buf1,buf2,buf3,buf4,buf5,buf6,buf7]);
console.log(finalBuffer.toString());


var socket = new net.Socket();

socket.connect (PORT, HOST, function() {
console.log('CONNECTED TO: ' + HOST + ':' + PORT);

socket.write(finalBuffer);

});


socket.on('handleData', function(data){

console.log("handleData function()>>send response>>>>>>>>>>>>");
	console.log("data is >>>>>>>>>>>>>"+data);





/*console.log("parse data is :::"+buf.readUInt16(9,2));
console.log("parse data is :::"+buf.readUInt16(11,2));
console.log("parse data is :::"+buf.toString('ascii',13,buf.length));*/
if(auth != true){

var buf = new Buffer(data);

console.log("parse data is :::"+buf.readUInt8(0,1));
console.log("parse data is :::"+buf.toString('ascii',1,5));
console.log("parse data is :::"+buf.readUInt8(6,1));
console.log("parse data is :::"+buf.readUInt16BE(7,2));
console.log("parse data is :::"+buf.readUInt16BE(9,2));
console.log("parse data is :::"+buf.readUInt16BE(11,2));
console.log("parse data is :::"+buf.toString('ascii',13,buf.length));

var buf1 = new Buffer(1);
buf1.writeUInt8(6, 0);

var buf2 = new Buffer(1);
buf2.writeUInt8(0, 0);

var buf3 = new Buffer(1);
buf3.writeUInt8(0, 0);

var response = Buffer.concat([buf1,buf2,buf3]);
socket.write(response);
auth = true;
} else {

console.log("in else block>>>>"+data);

}

});


// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
socket.on('data', function(data) {
  //console.log('DATA: ' + data.toString());
//var res = new Buffer(data).toString('ascii');buf.toString('utf8',0,5);
console.log("data is >>>>>>>>>>>>>>>>>>."+data.toString("utf-8",0,data.length));
   


 socket.emit('handleData',data);
// socket.destroy();
 //console.log( data.readUIntLE(0, 6).toString(16));
  // Close the client socket completely
  //    client.destroy();
});

socket.on('error', function(exception){
  console.log('Exception:');
  console.log(exception);

  if(exception.code == 'ECONNREFUSED') {
        console.log('Is the server running at ' + PORT + '?');

        socket.setTimeout(4000, function() {
            socket.connect(PORT, HOST, function(){
                console.log('CONNECTED TO: ' + HOST + ':' + PORT);
                //socket.write('I am the inner superman');
            });
        });

        console.log('Timeout for 5 seconds before trying port:' + PORT + ' again');

    } 


});


socket.on('drain', function() {
  console.log("drain!");
});

socket.on('timeout', function() {
  console.log("timeout!");
});

// Add a 'close' event handler for the client socket
socket.on('close', function() {
   console.log('Connection closed');
});



}catch(ex){
console.log(ex);
}
