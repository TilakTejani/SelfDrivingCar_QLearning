class Traffic{
    constructor(y, height, cnt = 10, range = 300, laneCount, lane){
        this.y = y;
        this.start = y;
        this.height = height        // height of car
        this.infinity = 100200
        
        this.cars = [];
        this.range = range;
        this.laneCount = laneCount
        
        this.yCoords = []
        
        for(let i = -this.infinity ; i <= this.infinity ; i += this.range){
            this.yCoords.push(i)
        }
        
        this.begin = find(this.yCoords, this.y)
        
        for(let i = this.begin - 2; i <= this.begin + 2 ;++i){
            if(i != this.begin){
                this.cars.push(this.#getLine(this.yCoords[i], -1))
            }
            else{
                this.cars.push(this.#getLine(this.yCoords[i], (lane + 2) % laneCount))
            }
        }
        
        
        this.first = this.begin - 2;
        this.last = this.begin + 2;
    }

    // #checkY(x, y){
    //     this.cars.forEach(car => {
    //         if(x == car.x && y > car.y - car.height - 10 && y < car.y + car.height + 10){
    //             return false;
    //         }
    //     })
    //     return true;
    // }
    #getLine(y, num = -1){
        if(num == -1)
            num = Math.floor(Math.random() * this.laneCount)
        
        let line = []
        for(let i = 0 ; i < this.laneCount ; ++i){
            if(i != num){
                line.push(new Car(road.getLaneCenter(i), y, carCanvas.width * 0.9/6 * 0.4, carCanvas.width * 0.9/6 * 0.7, "DUMMY", 2.75));
            }
            else{
                continue;
            }
        }
        this.yCoords.push(y);
        return line
    }
    // #getY(x){
    //     let y = Math.random() > 0.5 ? 
    //             lerp(this.frontMax, this.frontMin , Math.random()) :
    //             lerp(this.backMin, this.backMax, Math.random())
    //     while(!this.#checkY(x, y)){
    //         y = Math.random() > 0.5 ? 
    //             lerp(this.frontMax, this.frontMin, Math.random()) :
    //             lerp(this.backMin, this.backMax, Math.random())
    //     }
    //     return y
    // }
    // #getCar(laneCount, laneNum, y){
    //     let angle = 0
    //     let car;
    //     if(Math.random() > 0.5){
    //         let lane = Math.floor(Math.random() * laneCount / 2)
    //         let x = road.getLaneCenter(lane)
    //         car =  new Car(x, this.#getY(x), 30, 50, "DUMMY", 2.75)
    //     }
    //     else{
    //         let lane = laneCount/2 + Math.floor(Math.random() * laneCount/ 2)
    //         let x = road.getLaneCenter(lane)
    //         car =  new Car(x, this.#getY(x), 30, 50, "DUMMY", 2.75)
    //         angle = Math.PI
    //     }
    //     car.angle = angle;
    //     return car
    // }

    update(y, laneCount){
        
        // traffic cars has to spawn in particular range within OutBestCar
        // for memory efficient purpose
        this.y = y;
        // this.frontMax = this.y - 3 * this.range
        // this.frontMin = this.y - 2 * this.range
        // this.backMin = this.y + 2 * this.range
        // this.backMax = this.y + 3 * this.range 
        
        let x = find(this.yCoords, this.y);
        
        if(x > this.first + 2){
            this.cars.shift()
            this.cars.push(this.#getLine(this.yCoords[this.last + 1]))
            this.first++;
            this.last++;
        }
        else if(x < this.first + 2){
            this.cars.pop();
            this.cars.unshift(this.#getLine(this.yCoords[this.first - 1]))
            this.last--;
            this.first--;
        }

        
        this.cars.forEach(
            (trafficcars) => trafficcars.forEach(
                car => car.update(road.borders, this.cars, true)
            )
        )
    }

    // draw(ctx){
    //     this.cars.forEach((trafficcars) => trafficcars.draw(ctx))
    // }
}