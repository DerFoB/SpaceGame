export function collision(obj1, obj2){
    if(obj1.x + obj1.width > obj2.x &&
        obj1.y + obj1.height > obj2.y &&
        obj1.x < obj2.x + obj2.width && 
        obj1.y < obj2.y + obj2.height &&
        obj1.visible === true &&
        obj2.visible === true
    ){
        return true;
    } else { return false; }
}

export function deleteObjectFromArray(arr, obj){
    return arr.filter(u => u != obj);
}

