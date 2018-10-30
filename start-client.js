const args = ['start'];
const opts = {stdio: 'inherit', cmd: 'client', shell: true};
require('child_process').spawn('npm', args, opts);