const { AsyncParser } = require('json2csv');
const writeFile = require('fs').writeFile;

 
const fields = [
    'id',
    'status',
    'assignedToId',
    'userId',
    'request',
    'closedDate',
    'createdAt',
    'updatedAt',
];

const opts = { fields };
const transformOpts = { highWaterMark: 8192 };
 
const asyncParser = new AsyncParser(opts, transformOpts);
 
let csv = '';

module.exports.exportCSV = (data) => {
    console.log('it hot here===')
    asyncParser.processor
    .on('data', chunk => (csv += chunk.toString()))
    .on('end', () => {
        writeFile(`./ticketsClosedInPastMonth-${new Date()}.csv`, csv, (err) => {
            if (err) {
                throw new Error(err);
            }
            return 'done';
        });
    
    })
    .on('error', err => { throw new Error(err); });
    
    asyncParser.transform
    .on('error', err => { throw new Error(err); });
    
    
    asyncParser.input.push(data);
    asyncParser.input.push(null);
}