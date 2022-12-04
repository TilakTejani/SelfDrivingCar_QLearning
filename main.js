const networkCanvas = document.getElementById("networkCanvas");
const carCanvas = document.getElementById("carCanvas");
const chartCanvas = document.getElementById("scoreChart");
const bestBrainCanvas = document.getElementById("bestBrainCanvas");

networkCanvas.width = 400;
chartCanvas.width = 400;
carCanvas.width =
  window.innerWidth - networkCanvas.width - chartCanvas.width - 20;
bestBrainCanvas.width = chartCanvas.width;

console.log(chartCanvas.height);
console.log(bestBrainCanvas.height);
let carCtx = carCanvas.getContext("2d");
let networkCtx = networkCanvas.getContext("2d");
let chartCtx = chartCanvas.getContext("2d");
let bestBrainCtx = bestBrainCanvas.getContext("2d");
bestBrainCanvas.height =
  window.innerHeight -
  document.getElementById("inputs").clientHeight -
  chartCanvas.height -
  10;


  let laneCount = 6;
  const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, laneCount);
  var traffic = null;
  
  // let AGENTS = 100;
  // let ITERATIONS = 300;
  // let NEURONS = [sensorCount, 6, 4, 4];


// const carCount = AGENTS;
// let generation = 1;
// let bestGeneration = 0;
// let startingLine = 0;
// let score = 0;
// let highScore = 0;
// let animationReq;
// let iteration = 0;
// let savedBrain = null;
// let alive = AGENTS
// var cars = [];
// var damaged = [];
// let brain = NEURONS;
// let bestCar = null, bestScore = null;

// initiateAll();

// async function initiateAll() {
//   cars = [];
//   iteration = 0;
//   brain = NEURONS;
//   let lane = Math.floor(Math.random() * laneCount)
  
//   for (let i = 0; i < carCount; ++i) {
//     cars.push(new Car(road.getLaneCenter(lane), 100, carCanvas.width * 0.9/6 * 0.4, carCanvas.width * 0.9/6 * 0.7, "AI", 7, sensorCount, spread, brain, "rgb(107, 26, 179)" ));
//   }
  
//   startingLine = cars[0].y;
//   bestCar = cars[0]
//   bestScore = 0
//   alive = cars.length
  
//   traffic = new Traffic(
//     cars[0].y,
//     cars[0].height,
//     trafficCount,
//     500,
//     laneCount,
//     lane
//   );

//   for (let i = 0; i < carCount; ++i) {
//     if (savedBrain) {
//       cars[i].brain = NeuralNetwork.getCopy(cars[i].brain, savedBrain);
//     }
//     // Mutation 
//     // if(generation - bestGeneration > 20 && i < carCount/2){
//     //   NeuralNetwork.mutate(cars[i].brain, 0.5);
//     // }
//     // else{
//       NeuralNetwork.mutate(cars[i].brain, mutateAmount);
//     // }
//   }
//   carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
//   writeText(carCtx, "Generation: " + generation, 100, 100, 30);
//   // await new Promise(x => setTimeout(x, 1000))
// }


async function start() {
  // await initiateAll();
  // disableInput();
  // await animate();
  await startModel();
}

function stop() {
  // enableInput();
  cancelAnimationFrame(animationReq);
}

function storeData() {
  storeChartImage();
}

function saveBrain(){
  localStorage.setItem('savedBrain', JSON.stringify(bestCar.brain));
}

// writeText(bestBrainCtx, "Best Brain", 30, 20, 20, "gray");

// async function animate(time) {
  //   iteration++;
  //   carCanvas.height =
  //     window.innerHeight - document.getElementById("inputs").clientHeight;
  //   networkCanvas.height =
  //     window.innerHeight - document.getElementById("inputs").clientHeight;
  //   // --------------------- UPDATION -------------------------------
  
  //   // car updation
  //   for (let i = 0; i < cars.length; ++i) {
    //     if(!cars[i].damaged){
      //       cars[i].update(road.borders, traffic, false, startingLine)
      //       if (cars[i].damaged) {
        //         alive--;
        //       }
        //     }
        //     else
        //       continue;
        //   }
        
        //   let newBestScore = Math.max(...cars.map((car) => car.score))
        //   let newBestCar = cars.find(
//     (car) => car.score == newBestScore
//   )
//   // console.log(bestPosition)
//   if(bestCar == null || newBestScore > bestScore){
//     bestCar = newBestCar
//     bestScore = newBestScore
//   }

//   // traffic updation
//     traffic.update(bestCar.y, laneCount);

//   // if all cars are dead
//   if (alive <= 0 || iteration == ITERATIONS) {
  //     if (bestScore > highScore) {
//       bestGeneration = generation;
//       console.log("bestGeneration : " + bestGeneration + " Saving data");
//       savedBrain = bestCar.brain
//       // save(bestCar.brain)
//       if (localStorage.getItem("bestBrain")) {
//         Visualizer.drawNetwork(
//           bestBrainCtx,
//           savedBrain
//         );
//       }
//       iteration = 0
//       highScore = bestScore;
//     }
//     generation++;
//     updateScoreChart(chartCtx, bestCar.position);
//     await initiateAll();

//   }

//   // ---------------------- DRAWING ----------------------------
//   // -------------- CAR DRAWING ---------------------
//   carCtx.save();
//   carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

//   road.draw(carCtx);
//   // traffic.draw(carCtx);
//   traffic.cars.forEach((trafficcar) => trafficcar.forEach((car) => car.draw(carCtx)));

//   cars.forEach((car) => car.draw(carCtx, false, 0.2));
//   bestCar.draw(carCtx, true, 1);


//   // ---------------------------------------

//   networkCtx.lineDashOffset = time / 60;
//   Visualizer.drawNetwork(networkCtx, bestCar.brain);

//   carCtx.restore();
//   writeText(carCtx, "Score : " + bestCar.position, 30, 60, 20);
//   writeText(carCtx, "Generation : " + generation, 30, 80, 20);
//   writeText(carCtx, "Iteration : " + iteration, 30, 100, 20);
//   requestAnimationFrame(animate);
// }

// --------------------------------------------------------------------------------------------------------------------------

let car = null;
let oldBrain  = null;
let Episodes = 100
let Iteration = 500
let batch_size = 128     // keep it in 2^n form for simple calc
let memory_size = 5000
let delay = 1000
let log_interval_episodes = 5
let lastScore = 0

async function drawEverything(episode, itr){
      // ---------------------- DRAWING ----------------------------
      // -------------- CAR DRAWING ---------------------
        carCanvas.height =
      window.innerHeight - document.getElementById("inputs").clientHeight;
    networkCanvas.height =
      window.innerHeight - document.getElementById("inputs").clientHeight;
      
      
      // carCtx.save();
      // carCtx.translate(0, -car.y + carCanvas.height * 0.7);
      
      // road.draw(carCtx);
      // // traffic.draw(carCtx);
      // traffic.cars.forEach((trafficcar) => trafficcar.forEach((car) => car.draw(carCtx)));

      // car.draw(carCtx, true, 1)
      // carCtx.restore();

      // ---------------------------------------

      writeText(carCtx, "Generation : " + episode, 30, 40, 20);
      writeText(carCtx, "Score : " + car.score, 30, 60, 20);
      writeText(carCtx, "Iteration : " + itr, 30, 80, 20);
      await new Promise(x => setTimeout(x, 10))
}

async function reset(){
  brain = [2,3,4];
  let lane = Math.floor(Math.random() * laneCount)
  car = new Car(road.getLaneCenter(lane), 100, carCanvas.width * 0.9/6 * 0.4, carCanvas.width * 0.9/6 * 0.7, "AI", 7, sensorCount, spread, brain, "rgb(107, 26, 179)" , memory_size)
  startingLine = car.y
  traffic = new Traffic(
        car.y,
        car.height,
        trafficCount,
        500,
        laneCount,
        lane
      );
  car.update(road.borders, traffic, false, startingLine)
}

async function startModel(){
  carCanvas.height =
    window.innerHeight - document.getElementById("inputs").clientHeight;
  networkCanvas.height =
    window.innerHeight - document.getElementById("inputs").clientHeight;

  
  for (let i = 0 ; i < Episodes ; ++i){
  
    await reset();
    if(oldBrain){
      car.brain = oldBrain
    }
    let state = car.state

    for(let time = 0 ; time < Iteration ; ++time){
      let action = await car.brain.act(state)
      action = action.indexOf(Math.max(...action))
      car.control.forward = ( (action == 0 || action == 1 || action == 7) ? true : false)
      car.control.left = ( (action == 5 || action == 6 || action == 7) ? true : false)
      car.control.right = ( (action == 1 || action == 2 || action == 3) ? true : false)
      car.control.backward = ( (action == 3 || action == 4 || action == 5) ? true : false)

      car.update(road.borders, traffic, false, startingLine)

      next_state = car.state
      reward = car.score
      done = car.damaged

      if(done){
          reward = -10
      }
      await car.brain.remember(state, action, reward, next_state, done)
      
      // state = next_state
      
      if(done){
        console.log("generation:" +i+"/"+Episodes+ ", Score:"+car.score+", Epsilon:"+car.brain.epsilon )
        oldBrain = car.brain;
        updateScoreChart(chartCtx, car.score);
        break;
      }
      oldBrain = car.brain;
      
      await drawEverything(i + 1, time)
    }
    
    
    if(car.brain.memory.length > batch_size){
      // console.log("Replaying memory")
        await car.brain.replay(batch_size)
        // await new Promise(x => setTimeout(x, 1000))
    }

    // if(i % log_interval_epsiodes == 0){
    //   car.brain.model.save('output_dir_weights:' + i + ".hdf5")
    //   car.brain.model.save('output_dir_weights:' + i)
    // }
    await new Promise((x) => setTimeout(x, delay))
  }
  storeDate()
}


