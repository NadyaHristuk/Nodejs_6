const fs = require('fs');

const zlib = require('zlib');

const test1 = 'test_1.txt';

fs.createReadStream(test1)
.pipe(zlib.createGzip())
.on('end', ()=>{
    console.log('read end');
})
.pipe(fs.createWriteStream(test1 + '.gz'))
.on('close', () => {
    console.log('Closed')
})