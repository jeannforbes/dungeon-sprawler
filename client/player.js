class Player{
    constructor(id){
        this.id = id;
        this.name = 'Anonymous';
        this.model;
    }

    moveTo(loc){

    }


    // Sends a death message to the player and server
    //   expecting player to confirm death
    // socket - socket connected to server
    // tid - ID of the trap that killed the player
    kill(socket, tid){
        if(!io || !tid){
            console.log('Cannot kill player without socket and tid');
            return false;
        }
        socket.emit('killPlayer', {
            pid: this.id,
            tid: tid,
        });
    }

    // When you just wanna get them out of there
    kick(){
        socket.emit('kickPlayer', {
            pid: this.id
        });
    }
}