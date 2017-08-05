var chalk = require('chalk');

function inform(data){
    console.log(chalk.blue(data));
}

function alert(data){
    console.error(chalk.magenta(data));
}

// function titleGen (title){
//     if(title){
//         return title.replace(/\s+/g, '_').replace(/\W+/g, '');
//     }
//     return Math.random().toString(36).substring(2, 7);
// }

module.exports = {
    inform, alert
}
