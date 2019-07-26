// process
// .stdin
// .on('readable', () => {
//     let chunk;
//     while((chunk = process.stdin.read())!== null) {
//         console.log(`Block read: size (${chunk.length} )- ${chunk.toString()}`);
//     }
// })

process
.stdin
.on('data', chunk => {    
        console.log(`Block read: size (${chunk.length} ) - ${chunk.toString()}`);
    
})