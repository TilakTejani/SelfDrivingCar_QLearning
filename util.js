//   utility functions
// saving best Brain
/*
dir = Math.floor(Date.now());
import { mkdirSync, writeFile } from "fs";
mkdirSync(dir.toString());

function save(brain) {
  let str = JSON.stringify(brain)
  writeFile(dir + "/" + Date.now() + ".txt", data = str,(err) => {
    // In case of a error throw err.
      if (err) throw err;
    }
  );
}
*/

// loading existing brain
// const fileSelector = document.getElementById('file-selector');
// fileSelector.addEventListener('change', function() {
//     var fr=new FileReader();
//     fr.onload=function(){
//         inputbrain=JSON.parse((fr.result));
//         console.log(inputbrain)
//         Visualizer.drawNetwork(networkCtx, inputbrain);
//     }
//     fr.readAsText(this.files[0]);
    
// });


function lerp(A, B, t){
    return A + (B - A) * t;
}

function getIntersection(A, B, C, D){
    let tTop = (A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y)
    let uTop = (A.x - B.x) * (C.y - A.y) - (A.y - B.y) * (C.x - A.x)
    let bottom = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x) 

    if(0 != bottom){
        const t = tTop / bottom
        const u = uTop / bottom

        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
        return null
    }
}

function polyIntersect(poly1, poly2){
    for(let i = 0 ; i < poly1.length ; ++i){
        for(let j = 0 ; j < poly2.length ; ++j){
            if(getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            )){
                return true
            }
        }
    }

    return false
}

function getRGBA(val){
    const alpha = Math.abs(val)
    const R = val < 0 ? 0 : 255
    const G = R
    const B = val > 0 ? 0 : 255
    return "rgba("+R+","+G+","+B+","+alpha+")"
}

function getColor(){
    return "hsl(" + Math.floor(Math.random() * 360) + ",100% ,25%)"
}

function writeText(ctx, text, x, y, size = 10, fillstyle = "#0a0a0a"){
    ctx.beginPath()
    ctx.font = size + "px Arial";
    ctx.fillStyle = fillstyle
    ctx.strokeStyle = "#0a0a0a"
    ctx.fillText(text, x, y);
    ctx.fill()

    ctx.stroke()
}

function find(arr, x){
    let l = 0 , r = arr.length - 1, mid = Math.floor(l + (r - l)/2);
    while(l < r){
        mid = Math.floor(l + (r - l)/2);
        if(arr[mid] < x){
            l = mid + 1;
        }
        else{
            r = mid;
        }
    }
    mid = Math.floor(l + (r - l)/2);
    return arr[mid] == x ? mid : mid - 1;
}

function getRandomSubset(A, B){
    A.sort((a, b) => {
        return Math.random() - 0.5
    })

    return A.slice(0, B);
}

function arrayToBinary(out){
    let Max = Math.max(...out)
    let res = out.map((x) => x == Max ? 1 : 0)
    let ans = {"arr" : out, "bin" : res}
    return ans
}


function save(bestCar){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain))
}

function discard(){
    localStorage.removeItem("bestBrain")
}