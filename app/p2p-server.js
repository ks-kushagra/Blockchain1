const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers= process.env.PEERS ? process.env.PEERS.split(',') : []; //ternary operation

class P2pServer {
    constructor(blockchain){
        this.blockchain = blockchain;
        this.sockets =[];
    }

    listen() {  //starts the server
     
        const server = new Websocket.Server({port: P2P_PORT });
        server.on('connection' , socket => this.connectSocket(socket)); //listen for connection
        
        this.connectToPeers();
        
        console.log(`Listening for peer to peer connectin on ${P2P_PORT}`)
    }


    connectToPeers() {
        peers.forEach(peer => {
            
            const socket = new Websocket(peer);

            socket.on('open',() => this.connectSocket(socket));
        });
    } 


    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket Connected');

        this.messageHandler(socket);

     
        this.sendChain(socket);
        
    }


    messageHandler(socket) {
        socket.on('message',message => {
            const data = JSON.parse(message); //stringify object
          //  console.log('data',data);

        this.blockchain.replaceChain(data);

        });
    }


    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));

    }


    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }

}

module.exports = P2pServer;