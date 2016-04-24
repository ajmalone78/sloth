import Promise from 'bluebird';
import _ from 'lodash';
import crypto from 'crypto';

const cryptoTypes = ['md5', 'sha1', 'sha256', 'base64'];

module.exports = {
  commands: [{
    alias: ['encrypt', 'hash'],
    command: 'encrypt'
  }, {
    alias: ['randomdata'],
    command: 'randomData'
  }],
  help: [{
    command: ['encrypt', 'hash'],
    usage: 'crypto '
  }, {
    command: ['randomdata'],
    usage: 'randomdata <length> - Returns random hash'
  }],
  encrypt(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: crypto <algorithm> <text>'
        })

      let type = input.split(' ')[0].toLowerCase();
      let toHash = _.slice(input.split(' '), 1).join(' ');
      if (!_.includes(cryptoTypes, type))
        return reject("Error: Unsupported algorithm");
      if (!toHash)
        return reject("Error: I need something to hash");
      if (toHash.length > 90)
        return reject("Input must be <= 90")

      var hash;
      switch (type) {
        case 'md5':
        case 'sha1':
        case 'sha256':
          try {
            hash = ((crypto.createHash(type)).update(toHash)).digest('hex');
          } catch (err) {
            return reject(err);
          }
          break;
        case 'base64':
          hash = (new Buffer(toHash)).toString('base64');
          break;
      }

      return resolve({
        type: 'channel',
        message: hash
      })
    });
  },
  randomData(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: randomdata <length> - Returns random data at custom length'
        })

      let count = parseInt(input);

      if (!count || count > 90)
        return reject(count ? 'Count must be less <= 90' : 'Invalid number');

      crypto.randomBytes(count, (err, buf) => {
        if (err) return reject(err);
        return resolve({
          type: 'channel',
          message: buf.toString('hex')
        });
      });
    });
  }
};