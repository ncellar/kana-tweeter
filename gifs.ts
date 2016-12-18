import * as fs          from 'fs'
import * as request     from 'request-promise-native'
import * as promisify   from 'es6-promisify'
import * as mkdirp      from 'mkdirp'
import * as gm          from 'gm'
import * as _download   from 'download-file'

function promisify_unbound(f) {
    let flat = promisify(function(self, ...args) { return f.apply(self, args) })
    return function(...args) { return flat(this, ...args) }
}

gm.prototype.write_promise = promisify_unbound(gm.prototype.write)

let download = promisify(_download)
let unlink   = promisify(fs.unlink)

// ----------------------------------------------------------------------------

let kanas =
    fs.readFileSync('kana.txt', 'utf8')
    .split('\n')
    .map(line => line.split('\t'))

async function fetch_gif_throws (roma, kana, type)
{
    let page_url = encodeURI(`https://commons.wikimedia.org/wiki/File:${type}_${kana}_stroke_order_animation.gif`)

    let gif_url_regex = RegExp(`https://upload.wikimedia.org/wikipedia/commons/.*?/${type}_.*?_stroke_order_animation.gif`)

    let page_data = await request(page_url)

    let gif_url = gif_url_regex.exec(page_data)[0]

    return download(gif_url, {filename: `gifs/${roma}_${type}.gif`})
}

function fetch_gif (roma, kana, type)
{
    return fetch_gif_throws(roma, kana, type)
    .catch(e => Promise.reject(`could not download ${roma}_${type}.gif`))
}

async function make_kana_gif (hira, kata, roma)
{
    let hira_gif = fetch_gif(roma, hira, 'Hiragana')
    let kana_gif = fetch_gif(roma, kata, 'Katakana')

    await Promise.all([hira_gif, kana_gif])

    await gm()  .in(`gifs/${roma}_Hiragana.gif`)
                .in(`gifs/${roma}_Katakana.gif`)
                .write_promise(`gifs/${roma}.gif`)

    return Promise.all([
        unlink(`gifs/${roma}_Hiragana.gif`),
        unlink(`gifs/${roma}_Katakana.gif`)])
}

// for testing
// let kanas2 = [['あ', 'ア', 'A']]

if (!fs.existsSync('gifs')) fs.mkdirSync('gifs')

for (let [hira, kata, roma] of kanas)
{
    if ('GZJDBPV'.indexOf(roma[0]) < 0 && ['WI', 'WE'].indexOf(roma) < 0)
    {    
        make_kana_gif(hira, kata, roma)
        .catch(e => console.log(e))
    }
}