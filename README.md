# Kana Tweeter

https://twitter.com/kanatweeter

One kana (hiragana + katakana), every hour.

## Install to Heroku

    git clone git@github.com:norswap/kana-tweeter.git
    cd kana-tweeter
    npm install

    heroku git:remote -a <YOUR-HEROKU-APP>

    # insert your own keys
    heroku config:set TWITTER_CONSUMER_KEY=''
    heroku config:set TWITTER_CONSUMER_SECRET=''
    heroku config:set TWITTER_ACCESS_TOKEN=''
    heroku config:set TWITTER_ACCESS_TOKEN_SECRET=''

    # write vars to .env for local execution
    touch .env
    heroku config:get TWITTER_CONSUMER_KEY          -s  >> .env
    heroku config:get TWITTER_CONSUMER_SECRET       -s  >> .env
    heroku config:get TWITTER_ACCESS_TOKEN          -s  >> .env
    heroku config:get TWITTER_ACCESS_TOKEN_SECRET   -s  >> .env

    heroku local # test locally

    # install heroku scheduler addon
    heroku addons:create scheduler:standard

    # configure the scheduler with command "node bot.js"
    heroku addons:open scheduler

    # make sure the bot won't post on deploy
    heroku ps:scale web=0

    git push heroku master # deploy to heroku
