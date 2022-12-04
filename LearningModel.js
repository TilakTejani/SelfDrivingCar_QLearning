// const { OneToManyIterator } = require("@tensorflow/tfjs-data/dist/iterators/lazy_iterator")

let result = null
class LearningModel{
    constructor( stateSize, actionSize, memorySize)   {
        this.stateSize = sensorCount
        this.actionSize = 8
        this.memory_size = memorySize
        this.memory = []

        this.gamma = 0.95

        this.epsilon = 1.0
        this.epsilonDecay = 0.995
        this.epsilonMin = 0.01

        this.model = this.#getModel();
        
        this.learningRate = 0.001
    }   

    async #getModel(){
        // const input = tf.input({shape: [this.stateSize]});

        // // First dense layer uses relu activation.
        // const denseLayer1 = tf.layers.dense({units: 10, activation: 'linear'});
        // // Second dense layer uses softmax activation.
        // const denseLayer2 = tf.layers.dense({units: this.actionSize, activation: 'sigmoid'});

        // // Obtain the output symbolic tensor by applying the layers on the input.
        // const output = denseLayer2.apply(denseLayer1.apply(input));

        // // Create the model based on the inputs.
        // let model = tf.model({inputs: input, outputs: output});

        let model = tf.sequential()
        model.add(tf.layers.dense({units: 24, inputShape: [this.stateSize], activation : 'relu'}))
        model.add(tf.layers.dense({units: 24, activation : 'relu'}))
        model.add(tf.layers.dense({units: this.actionSize, activation : 'linear'}))

        model.compile({loss: 'meanSquaredError', optimizer: 'Adam'})
        
        // model.predict(tf.ones([2, 10])).array();
        return model
    }

    async remember(state, action, reward, nextState, done){
        // console.log(this.memory.length)
        if(this.memory.length > this.memory.size){
            console.log('1')
            this.memory.shift()
        }

        this.memory.push({
            "state" : state,
            "action" : action,
            "reward" : reward,
            "nextState" : nextState,
            "done" : done
        })
    }

    async calc(state){
        // state = tf.reshape([...state], [10, 1])
        var act_values = null;
        let  output = await this.model.then(async (res) => {
            let input = [[...state]]
            let something = await res.predict(tf.tensor2d(input)).data()
            let out = Array.from(something)
            return out;
        });
        return (Array.from(output))
    }

    async act(state = Array(10).fill(0)){

        // to try random possibilities in beginings
        if(Math.random() <= this.epsilon){
            let res = Array(this.actionSize)
            for(let i = 0 ; i < this.actionSize ; ++i){
                res[i] = Math.random()
            }
            return res
        }
        return await this.calc(state)
    }
    
    async replay(batch_size){
        console.log("replaying")
        // choose random minibatch
        let minibatch = getRandomSubset(this.memory, batch_size)

        for(let i = 0 ; i < batch_size ; ++i){
            let sample = minibatch[i];
            let {state, action, reward, nextState, done} = sample
            let target = Array.from(await this.calc(state))
            let Q_sa = Array.from(await this.calc(nextState))
            if(!done){
                target[action] = reward + this.gamma*Math.max(...Q_sa)
            }
            else{
                target[action] = reward
            }
            // console.log("Target output: ", target_f)
            await this.model.then(async (res) => {
                // console.log("1")
                let input = tf.tensor2d([[...state]])
                let output = tf.tensor2d([[...target]])
                // console.log(input, output)
                await res.fit(input, output, {epochs: 1, verbose: 0})
                // console.log("2")
            })
        } 
        if(this.epsilon > this.epsilonMin){
            this.epsilon *= this.epsilonDecay
            // console.log("Epsilon decayed")
        }
        console.log("Learning done")
    }
}
