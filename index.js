const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Create dummy application for heroku
app.get('/', (req, res) => res.send('I\'m alive!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))