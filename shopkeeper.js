const WARE_TYPE = {
    DUNGEON_SMALL: {
        price: 0,
        xSize: 5,
        zSize: 5,
        tiles:
        'wwdww'+
        'wfffw'+
        'dfffd'+
        'wfffw'+
        'wwdww',
        players: {} 
    },
    DUNGEON_MED: {
        price: 100,
        xSize: 8,
        zSize: 8,
        tiles:
        'wwwwdwww'+
        'wffffffw'+
        'wffffffw'+
        'wffffffw'+
        'dffffffd'+
        'wffffffw'+
        'wffffffw'+
        'wwwwdwww',
        players: {} 
    },
    DUNGEON_LARGE: {
        price: 10000,
        xSize: 10,
        zSize: 10,
        tiles:
        'wwwwwwwdww'+
        'wfffffffff'+
        'wfffffffff'+
        'wffffwffff'+
        'wfffffffff'+
        'wfffffffff'+
        'wffffwffff'+
        'dfffffffff'+
        'wfffffffff'+
        'wfffffffff',
        players: {}
    },
}

const crypto = require('crypto');

const REFUND_RATE = 0.8;

class Ware{
    constructor(wareType){
        this.id = crypto.randomBytes(16).toString('hex');
        this.info = WARE_TYPE[wareType];
        console.log(this.info);
    }
}

class Ledger{
    constructor(pid){
        this.id = pid;
        this.trust = 0; // start with neutral trust
        this.balance = 0; // amt of gold
        this.purchases = {};
    }

    buy(wareType){
        if(!WARE_TYPE[wareType] || WARE_TYPE[wareType].price > this.balance)
            return false;
        else {
            let w = new Ware(wareType);
            this.purchases[w.id] = w;
            return w;
        }
    }

    sell(wid){
        // If everything checks out
        if(this.purchases[wid]){
            this.balance += this.purchases[wid].price * REFUND_RATE;
            delete this.purchases[wid];
            return true;
        }

        // But if it looks shady
        let date = new Date();
        console.log((new Date()).getTime()+': '+this.id+' attempted illicit refund.');
        this.trust -= 1;
        return false;
    }

    trade(pid, wid){
        return false;
    }
}

class Shopkeeper{
    constructor(){
        this.ledgers = {};
    }

    openLedger(pid){
        this.ledgers[pid] = new Ledger(pid);
    }

    buy(pid, wareType){
        if(!this.ledgers[pid]){
            console.log((new Date()).getTime()+': '+pid+' cannot BUY without a ledger.');
            return false;
        }
        return this.ledgers[pid].buy(wareType);

    }

    sell(pid, wid){
        if(!this.ledgers[pid]){
            console.log((new Date()).getTime()+': '+pid+' cannot SELL without a ledger.');
            return false;
        }
        console.log((new Date()).getTime()+': '+pid+' bought a '+wareType);
        return this.ledgers[pid].sell(wid);
    }
}

module.exports = Shopkeeper;