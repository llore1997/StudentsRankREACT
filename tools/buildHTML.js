// This script copies src/index.html into /dist/index.html
// This is a good example of using Node and cheerio to do a simple file transformation.
// In this case, the transformation is useful since we only use a separate css file in prod.
import fs from 'fs';
import cheerio from 'cheerio';
import colors from 'colors';
import ncp from 'ncp';

var mkdirp = require('mkdirp');
//import assets from '../thirdparty.config.js';

/*eslint-disable no-console */
let assets = [
  {type:'css',base_path:'node_modules/toastr/build/',file:'toastr.min.css'},
  {type:'js',base_path:'node_modules/toastr/build/',file:'toastr.min.js'},
  {type:'css',base_path:'node_modules/bootstrap/dist/css/',file:'bootstrap.min.css'},
  {type:'js',base_path:'node_modules/bootstrap/dist/js/',file:'bootstrap.min.js'},
  {type:'js',base_path:'node_modules/popper.js/dist/',file:'popper.min.js'},
  {type:'css',base_path:'node_modules/font-awesome/css/',file:'font-awesome.min.css'},
  {type:'font',base_path:'node_modules/font-awesome/fonts',file:''},
  {type:'js',base_path:'node_modules/jquery/dist/',file:'jquery.min.js'}    
];

mkdirp('dist/lib' , function (err) {
  if (err) console.error(err)
  else console.log('dir created')
});

mkdirp('dist/css' , function (err) {
  if (err) console.error(err)
  else console.log('dir created')
});

for (let value of assets) {
  console.log(value.type);
  console.log(value.src);
  let dst = '';
  switch (value.type) {
    case 'js':
      dst = './dist/lib/'+value.file;            
      break;
    case 'css':
      dst = './dist/css/'+value.file;      
      break;
    case 'font':
      dst = './dist/fonts'+value.file;
      break;
    default:
      break;
  }
    
  ncp(value.base_path+value.file,dst, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('done!');
  });

}

ncp('./src/client/templates', './dist/templates', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('done!');
 });

fs.readFile('src/client/index.html', 'utf8', (err, markup) => {
  if (err) {
    return console.log(err);
  }

  const $ = cheerio.load(markup);

  // since a separate spreadsheet is only utilized for the production build, need to dynamically add this here.
  $('head').prepend('<link rel="stylesheet" href="styles.css">');

  for (let value of assets) {
    if (value.type==='css'){
      $('head').prepend('<link rel="stylesheet" href="css/'+ value.file +'">');
    }else if (value.type === 'js'){
      $('head').prepend('<script src="lib/' + value.file +'"></script>');      
    }
  }

  fs.writeFile('dist/index.html', $.html(), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('index.html written to /dist'.green);
  });
});