// will take context of canvas and draw neural network onto them
class Visualizer{
    static drawNetwork(ctx, network){
        const margin = 50
        const left = margin
        const top = margin
        const width = ctx.canvas.width - 2 * margin
        const height = ctx.canvas.height - 2 * margin

        const levelHeight = height / network.levels.length
        const {levels} = network


        for(let i = levels.length - 1 ; i >= 0 ; i--){
            const levelTop = top + lerp(height - levelHeight, 0, levels.length == 1? 0.5 : i/(levels.length - 1)) 
            ctx.setLineDash([7,3])
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i == (levels.length - 1)? ['🠉','🠈','🠊','🠋']: [])
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels){
        const right = left + width
        const bottom = top + height
        const {inputs, outputs, weights, biases} = level
        const nodeRadius = 18
        
        // drawing level weights
        for(let i = 0 ; i < inputs.length ; ++i){
            for(let j = 0 ; j < outputs.length ; ++j){
                ctx.beginPath();
                ctx.moveTo(
                    this.getNodeX(inputs, i, left, right), 
                    bottom
                )
                ctx.lineTo(
                    this.getNodeX(outputs, j, left, right), 
                    top
                )
                
                ctx.lineWidth = 2
                
                ctx.strokeStyle = getRGBA(weights[i][j])
                ctx.stroke()
            }
        }
        
        // drawing lowerNodes of level
        ctx.beginPath()
        for(let i = 0 ; i < inputs.length; ++i){
            const x = Visualizer.getNodeX(inputs, i, left, right)
            
            ctx.beginPath()
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI*2)
            ctx.fillStyle = "black"
            ctx.fill();

            ctx.beginPath()
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI*2)
            ctx.fillStyle = getRGBA(inputs[i])
            ctx.fill();

        }

        ctx.beginPath()
        // drawing upper nodes of level(for example output level)
        for(let i = 0 ; i < outputs.length; ++i){
            const x = Visualizer.getNodeX(outputs, i, left, right)
            
            ctx.beginPath()
            ctx.arc(x, top, nodeRadius , 0, Math.PI*2)
            ctx.fillStyle = "black"
            ctx.fill();
            
            ctx.beginPath()
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI*2)
            ctx.fillStyle = getRGBA(outputs[i])
            ctx.fill();

            ctx.beginPath()
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2)
            ctx.strokeStyle = getRGBA(biases[i])
            ctx.setLineDash([5,5])
            ctx.stroke()

            ctx.setLineDash([])
            if(outputLabels[i]){
                ctx.beginPath()
                ctx.textAlign = "center"
                ctx.textBaseLine = "middle"
                ctx.fillStyle = "black"
                ctx.strokeStyle = "gray"
                ctx.font = nodeRadius * 1.5  + "px Arial"
                ctx.fillText(outputLabels[i], x, top + nodeRadius*0.55)
                ctx.lineWidth = 0.5
                ctx.strokeText(outputLabels[i], x, top + nodeRadius*0.55)
            }
        }

    }

    static getNodeX(node, index, left, right){
        return lerp(left, right, node.length == 1 ? 0.5 : index/(node.length - 1))
    }
}