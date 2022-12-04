for (i in 1000){
    reset()
    state = [...car.sensors.readings]

    for(time in 5000){
        action = car.brain.act(state)
        car.controls.forward = action[0] ? true : false
        car.controls.left = action[1] ? true : false
        car.controls.right = action[2] ? true : false
        car.controls.backward = action[3] ? true : false

        car.update(roadBoarder, traffic, false, startingLine)

        next_state = [...car.sensors.readings]
        reward = car.score
        done = car.damaged

        if(done){
            reward = -10
        }
        car.brain.rememeber(state, action, reward, next_state, done)

        state = next_state
        if(done){
            console.log("Print data");
        }
        if(LearningModel.memory > batch_size){
            replay(memory)
        }
    }
}