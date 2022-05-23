const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.writeFile(
    path.join(__dirname, 'test.txt'),
    '',
    (err) => {
        if (err) throw err;
    }
);

stdout.write('Write your data here:\n');

stdin.on('data', data => {
    const dataStringified = data.toString().trim();
    fs.appendFile (
        path.join(__dirname, 'test.txt'),
        dataStringified,
        (err) => {
            if (err) throw err;
        }
    );
    if (dataStringified === 'exit') process.exit();
});

process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));
process.on('SIGINT', () => process.exit());