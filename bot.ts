import * as fs          from 'fs'
import * as promisify   from 'es6-promisify'
import * as Twit        from 'twit/lib/twitter'

let kanas       = fs.readFileSync('kana.txt', 'utf8').split('\n')
let variants    = fs.readFileSync('variants.txt', 'utf8').split('\n')
let index = Math.floor(Math.random() * (kanas.length - 1))
let [hira, kata, roma] = kanas[index].split("\t")

let url = encodeURI(`https://en.wikipedia.org/wiki/${hira}`)
let status = `${hira} / ${kata} : ${url}`

let T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           1000 * 60,
})

async function post_tweet_with_gif (roma)
{
    let gif = fs.readFileSync(`gifs/${roma}.gif`, { encoding: 'base64' })    
    let response = await T.post('media/upload', { media_data: gif })
    let media_id = response.data.media_id_string
    if (response.data.errors != undefined)
        return Promise.reject(response.data.errors)
    return T.post('statuses/update', { status: status, media_ids: [media_id] })
}

function post_tweet()
{
    if ('GZJDBPV'.indexOf(roma[0]) < 0 && ['WI', 'WE'].indexOf(roma) < 0)
    {
        return post_tweet_with_gif(roma)
    }
    else {
        let match = variants
            .map(it => it.split('\t'))
            .filter(it => it[0].indexOf(hira) >= 0)
        
        if (match.length > 0)
            return post_tweet_with_gif(match[0][1])
        else
            return T.post('statuses/update', { status: status })
    }
}

async function main()
{
    let response = await post_tweet()
    if (response.data.errors != undefined)
        console.log(response.data.errors)
}

main().catch(e => console.log(e))