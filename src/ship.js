export function Ship(name, length){

    let placed = false;

    if(length < 0){
        throw new Error('invalid length!');
    }

    let hits = 0;

    function hit(){
        if(hits < length){
            hits++;
        }
        return hits;
    }

    function isSunk(){
        return hits === length ? true : false;
    }

    function getLength(){
        return length;
    }

    function getName(){
        return name;
    }

    return {
        hit,
        isSunk,
        getLength,
        getName,
        isPlaced: () => placed,
        markPlaced: () => {placed = true},
        unmark: () => {placed = false}
    };
}