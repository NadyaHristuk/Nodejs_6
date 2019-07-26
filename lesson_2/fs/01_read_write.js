const fs = require('fs');

const file = './test_1.txt';

fs.readFile(file, (err, data) =>{
    if (err) {
        console.error(err.message);
        return;
    }
    if (!fs.existsSync('./temp')){
        fs.mkdirSync('./temp')
    }
    fs.writeFile('./temp/test02.txt', `${data.toString} + add text` , err => {
        if (err) {
            console.log(err);
            return;
        }
    })
})