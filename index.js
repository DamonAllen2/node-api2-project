// require your server and launch it here
const server = require('./api/server.js')
const port = 8000;

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})