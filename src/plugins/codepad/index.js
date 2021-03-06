import Promise from 'bluebird'
import _ from 'lodash'
import codepad from 'codepad'

const langs = ['C', 'C++', 'D', 'Haskell', 'Lua', 'OCaml', 'PHP', 'Perl', 'Python', 'Ruby', 'Scheme', 'Tcl']

export const plugin_info = [{
  alias: ['eval'],
  command: 'codep',
  usage: 'eval <language> <code>'
}]

export function codep(user, channel, input) {
  return new Promise(resolve => {
    if (!input || !input.split('```')[1])
      return resolve({
        type: 'dm',
        message: 'Usage: eval <langage> <code> | Evals the code in the specified language, valid languages are: ' + langs.join(' ')
      })

    let type = input.split(' ')[0]
    let code = _.unescape(input.split('```')[1])
    codepad.eval(type, code, (err, out) => {
      return resolve({ type: 'channel', message: !err ? 'Output: ```' + out.output + '```' : err })
    }, true)
  })
}
