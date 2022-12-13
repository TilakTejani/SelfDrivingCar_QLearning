// const { activationOptions } = require("@tensorflow/tfjs-layers/dist/keras_format/activation_config");

const carCanvas = document.getElementById("carCanvas");
const chartCanvas = document.getElementById("scoreChart");
const modelOutput = document.getElementById("output")

chartCanvas.width = 400;
carCanvas.width = window.innerWidth - 400 - chartCanvas.width - 20;
modelOutput.width = chartCanvas.width;

let carCtx = carCanvas.getContext("2d");
let chartCtx = chartCanvas.getContext("2d");


let laneCount = 6;
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, laneCount);
var traffic = null;
  
  
async function start() {
  await startModel();
}

function stop() {
  cancelAnimationFrame(animationReq);
}

function storeData() {
  storeChartImage();
}
let trial = 1
async function saveBrain(brain){
  // console.log("Brain", brain)
  // await brain.save("brain ", brain.model)
}

// writeText(bestBrainCtx, "Best Brain", 30, 20, 20, "gray");
let car = null;
let oldBrain  = null;
let Episodes = 10000
let Iteration = 500
let batch_size = 128     // keep it in 2^n form for simple calc
let memory_size = 5000
let delay = 1000
let epsilon_decay_interval = 5
let log_interval_episodes = 5
let lastScore = 0

async function drawSimulation(episode, itr){
      // ---------------------- DRAWING ----------------------------
      // -------------- CAR DRAWING ---------------------
        carCanvas.height =
      window.innerHeight - document.getElementById("inputs").clientHeight;
    
      carCtx.save();
      carCtx.translate(0, -car.y + carCanvas.height * 0.7);
      
      road.draw(carCtx);
      // traffic.draw(carCtx);
      traffic.cars.forEach((trafficcar) => trafficcar.forEach((car) => car.draw(carCtx)));

      car.draw(carCtx, true, 1)
      carCtx.restore();

      // ---------------------------------------

      writeText(carCtx, "Generation : " + episode, 30, 40, 20);
      writeText(carCtx, "Score : " + car.score, 30, 60, 20);
      writeText(carCtx, "Iteration : " + itr, 30, 80, 20);
      await new Promise(x => setTimeout(x, 10))
}



let visData = []

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
  
  let actionName = ['forward', 'right + forward', 'right', 'right + backward', 'backward', 'left + backward', 'left', 'left + forward']
  
  
  for (let i = 0 ; i < Episodes ; ++i){
    await reset();
    // const surface = { name: 'Model Summary', tab: 'Model Inspection'};
    // await tfvis.show.modelSummary(surface, await car.brain.model);
    let state = car.state

    if(oldBrain){
      car.brain = oldBrain
    }
    
    for(let time = 0 ; time < Iteration ; ++time){
      let action = await car.brain.act(state)
      visData = [['action_name', 'model_output']]
      for(let j = 0 ; j < action.length ; ++j){
        visData.push([actionName[j], action[j]])
      }
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
        if(car.score> lastScore){
          saveBrain(car.brain.model.then())
        }
        break;
      }
      oldBrain = car.brain;
      
      await drawSimulation(i + 1, time)
      await new Promise((x) => setTimeout(x, 1))
      const surface = tfvis.visor().surface({name : 'bar', tab:'some'})
      await tfvis.show.modelSummary(surface, await car.brain.model);
      
      // console.log(surface)
      // await tfvis.render.barchart(surface, visData);
    }
    
    if(car.brain.memory.length > batch_size){
      // console.log("Replaying memory")
        await car.brain.replay(batch_size, (i%epsilon_decay_interval == 0))
        // await new Promise(x => setTimeout(x, 1000))
    }
    
    // if(i % log_interval_epsiodes == 0){
    //   car.brain.model.save('output_dir_weights:' + i + ".hdf5")
    //   car.brain.model.save('output_dir_weights:' + i)
    // }
    await new Promise((x) => setTimeout(x, delay))
  }
  // storeDate()
}
