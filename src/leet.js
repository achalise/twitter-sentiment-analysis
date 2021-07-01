//concatenate array
function canFormArray(arr, pieces) {
    for(var i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const begin = arr.indexOf(piece[0]);
        for(var j = 0; j < piece.length; j++) {
            if (arr[begin + j] != piece[j]) {
                return false;
            }
        }
    }
    return true;
}


var result = canFormArray([91,4,64,78], [[78],[4,64],[91]]);
console.log(result);