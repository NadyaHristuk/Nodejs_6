const fs = require('fs');

fs.unlink('./temp/test02.txt', err =>{
    if (err) {
        console.log(err);
        return;
    }

    fs.rmdir('temp', err =>{
        if (err) {
            console.log(err);
            return;
        }
        console.log('del done!')
    });
})