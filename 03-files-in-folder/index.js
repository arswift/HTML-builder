const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder,
    { withFileTypes: true },
    (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (file.isFile()) {
            let ext = path.extname(file.name).slice(1);
            let name = file.name.replace(/\.[^/.]+$/, "");
            fs.stat(path.join(pathToFolder, file.name), (err, stats) => {
                if (err) throw err;
                console.log(`${name} - ${ext} - ${stats.size}b`);
            });
        }
      })
})