# Docker Demo

/lib/config.js

```
module.exports = {
  redis: {
    port: 6379,
    host: '',
    password: '',
    options: {
      auth_pass: ''
    }
  },
  azure: {
    storage: {
      accountName: '',
      accountKey: ''
    }
  },
  twitter: {
    consumer_key:	'',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: '',
    callback_url: 'http://127.0.0.1/twitter'
  }
};
```
