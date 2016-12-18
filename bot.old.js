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

    let status = `The sound ${kana[2]} is written ${kana[0]} (hiragana) or ${kana[1]} (katakana).`

    let T = new Twit({
      consumer_key:         process.env.TWITTER_CONSUMER_KEY,
      consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
      access_token:         process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms:           1000 * 60,
    })


    // T.post('media/upload', { media_data: b64content }, function (err, data, response)
    // {
    //     let media_id_str = data.media_id_string
    //     let alt_text = "stroke order diagram"
    //     let meta_params = { media_id: media_id_str, alt_text: { text: alt_text } }

    //     T.post('media/metadata/create', meta_params, function (err, data, response)
    //     {
    //         if (!err) {
    //             var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }

    //             T.post('statuses/update', params, function (err, data, response) {
    //                 console.log(data)
    //             })
    //         }
    //     })
    // })

    T.post('statuses/update', { status: status }, function(err, data, response) {
        if (err == undefined)
            fs.writeFileSync('timestamp', now)
        else
            console.log(err)
    })
}
