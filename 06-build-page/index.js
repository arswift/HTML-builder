const { mkdir, readdir, writeFile, appendFile, rm, copyFile, readFile } = require('fs/promises');
const { createReadStream } = require('fs');
const path = require('path');
const destPath = path.join(__dirname, 'project-dist');
const bundleHtmlPath = path.join(destPath, 'index.html');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');

const createFolder = (url) => mkdir(url, { recursive: true });

const copyFolder = (srcName) => {
    const targetPath = path.join(destPath, srcName);
    const srcPath = path.join(__dirname, srcName);


    createFolder(targetPath)
        .then(() => cleanFolder(targetPath))
        .then(() => copyFiles(srcPath, targetPath));
}

const cleanFolder = (url) => {
    readdir(url, {withFileTypes: true}).then(async (files) => {
        for (let file of files) {
            const filePath = path.join(url, file.name);
            if (file.isDirectory()) rm(filePath, { recursive: true });
            if (file.isFile()) rm(filePath);
        }
    })
}

const copyFiles = (urlSrc, urlDest) => {
    readdir(urlSrc, {withFileTypes: true}).then(async (files) => {
        for (let file of files) {
            const fileDestPath = path.join(urlDest, file.name);
            const fileSrcPath = path.join(urlSrc, file.name);
            if (file.isFile()) copyFile(fileSrcPath, fileDestPath);
            if (file.isDirectory()) {
                createFolder(path.join(urlDest, file.name));
                copyFiles(fileSrcPath, fileDestPath);
        } 
        }
    })
}

const createBundle = (bundleName) => writeFile(path.join(destPath, bundleName), '');

const readSpecFilesInDir = (urlSrc, ext, bundle) => {
    readdir(urlSrc).then(files => {{
        for (let file of files) {
            if (path.extname(file) === ext) readComponents(file, urlSrc, bundle);
        }
    }})
}

const readComponents = (file, urlSrc, bundle) => {
    const stream = createReadStream(path.join(urlSrc, file), 'utf-8');
    const bundlePath = path.join(destPath, bundle);
    let data = '';

    stream.on('data', chunk => data += chunk);
    stream.on('end', () => appendFile(bundlePath, data));
    stream.on('error', error => {throw error});
}

const bundleHtml = async () => {
    let template = await readFile(templatePath, 'utf-8');
    const components = await readdir(componentsPath, {withFileTypes: true});

    for (let el of components) {
        if (el.isFile() && path.extname(el.name) === '.html') {
            const elPath = path.join(componentsPath, el.name);
            const inclusion = await readFile(elPath, 'utf-8');
            template = template.replace(`{{${el.name.replace(/\.[^/.]+$/, "")}}}`, inclusion);
        }
    }

    await writeFile(bundleHtmlPath, template);
}


createFolder(destPath)
    .then(() => copyFolder('assets'))
    .then(() => createBundle('style.css'))
    .then(() => readSpecFilesInDir(stylesPath, '.css', 'style.css'))
    .then(() => bundleHtml());