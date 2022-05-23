const path = require('path');
const pathToSource = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'files-copy');
const { mkdir, readdir, unlink, copyFile } = require('fs/promises');

const reCreateFolder = () => mkdir(pathToCopy, { recursive: true });

const cleanDestinationFolder = () => {
    readdir(pathToCopy).then(files => {
        files.forEach(file => {
            const pathToFile = path.join(pathToCopy, file);
            unlink(pathToFile);
          })
    })
}

const reCopyFiles = () => {
    readdir(pathToSource).then(files => {
        files.forEach(file => {
            const pathToFile = path.join(pathToSource, file);
            copyFile(pathToFile, path.join(pathToCopy, file));
          })
    })
}

reCreateFolder()
    .then(() => cleanDestinationFolder())
    .then(() => reCopyFiles())
    .catch(error => {throw error});