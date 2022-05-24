const path = require('path');
const pathToSource = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'files-copy');
const { mkdir, readdir, unlink, copyFile } = require('fs/promises');

const createFolder = () => mkdir(pathToCopy, { recursive: true });

const cleanDestinationFolder = () => {
    readdir(pathToCopy).then(files => {
        files.forEach(file => {
            const pathToFile = path.join(pathToCopy, file);
            unlink(pathToFile);
          })
    })
}

const copyFiles = () => {
    readdir(pathToSource).then(files => {
        files.forEach(file => {
            const pathToFile = path.join(pathToSource, file);
            copyFile(pathToFile, path.join(pathToCopy, file));
          })
    })
}

createFolder()
    .then(() => cleanDestinationFolder())
    .then(() => copyFiles())
    .catch(error => {throw error});