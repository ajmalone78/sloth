import _ from 'lodash';
import Promise from 'bluebird';
import cluster from 'cluster';

module.exports = {
    commands: [{
        alias: ['shutdown'],
        userLevel: ['superadmin'],
        command: 'shutdown'
    }, {
        alias: ['restart'],
        userLevel: ['superadmin'],
        command: 'restart'
    }],
    help: [{
        command: ['shutdown'],
        usage: 'shutdown'
    }, {
        command: ['restart'],
        usage: 'restart'
    }],
    shutdown() {
        return new Promise((resolve, reject) => {
            resolve({
                type: 'channel',
                message: 'Shutting down in *3.. 2.. 1.*'
            });
            _.delay(process.exit, 3000);
        });
    },
    restart() {
        return new Promise((resolve, reject) => {
            resolve({
                type: 'channel',
                message: 'Restarting in *3.. 2.. 1.*'
            });
            cluster.fork();
            _.delay(process.exit, 3000);
        });
    }
};