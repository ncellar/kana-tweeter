let fs      = require('fs')
let Twit    = require('twit')

// Only post once every hour
// Not necessary if running through the heroku scheduler.

/*
let now = Date.now()
let old = fs.existsSync('timestamp')
    ? parseInt(fs.readFileSync('timestamp', 'utf8'))
    : 0
let diff = now - old

if (diff > 1000 * 60 * 60)
*/
{
    let kanas = fs.readFileSync('kana.txt', 'utf8').split("\n")
    let index = Math.floor(Math.random() * (kanas.length - 1))
    let kana  = kanas[index].split("\t")

    let status = `The sound '${kana[2]}' is written ${kana[0]} (hiragana) or ${kana[1]} (katakana).`

    let T = new Twit({
      consumer_key:         process.env.TWITTER_CONSUMER_KEY,
      consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
      access_token:         process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms:           1000 * 60,
    })

    T.post('statuses/update', { status: status }, function(err, data, response) {
        if (err == undefined)
            fs.writeFileSync('timestamp', now)
        else
            console.log(err)
    })
}
