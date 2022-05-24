const path = require('path');
const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(destPath, 'bundle.css');
const { mkdir, readdir, writeFile, appendFile } = require('fs/promises');
const { createReadStream } = require('fs');


const createDestFolder = () => mkdir(destPath, { recursive: true });

const createBundle = () => writeFile(bundlePath, '');

const readSrcDir = () => {
    readdir(srcPath).then(files => {{
        for (let file of files) {
            if (path.extname(file) === '.css') readFile(file);
        }
    }})
}

const readFile = (file) => {
    const stream = createReadStream(path.join(srcPath, file), 'utf-8');
    let data = '';

    stream.on('data', chunk => data += chunk);
    stream.on('end', () => appendFile(bundlePath, data));
    stream.on('error', error => {throw error});
}

createDestFolder()
    .then(() => createBundle())
    .then(() => readSrcDir());