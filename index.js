window.onload = function () {
    const scoreText = document.getElementById("point")
    const alertContainer = document.getElementById("alertContainer")
    const alertTitle = document.getElementById("alertTitle")
    const alertMessage = document.getElementById("alertMessage")
    const hexa = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]
    const canvas = document.createElement("canvas")

    let context =  canvas.getContext("2d"),
    score = 0 
    width = canvas.width = 600,
    height = canvas.height = 600
    canvas.style.border = "1px solid #000"

    scoreText.textContent = score.toString();
    document.body.appendChild(canvas)

   let points = [],
       box = [];

   points.push({
       x: 290,
       y: 545,
       oldX: 285,
       oldY: 540,
       color: "blue"
    })

    box.push({
        x: 250,
        y: 550,
        height: 40,
        width: 205,
        color: "red"
    });

    createBox()


    canvas.addEventListener("mousemove", doMove)

    update()

    function update() {
        updatePoints()
        renderPoints()
        renderBox()
        requestAnimationFrame(update)
    }


    function updatePoints() {
        for(let i = 0; i < points.length; i++) {
            const p = points[i]

            //Velocidade que o objeto se movimenta na tela no eixo X e Y a cada ciclo
            let vx = p.x - p.oldX
            let vy = p.y - p.oldY

            //Atualiza as posições oldX e oldY
            p.oldX = p.x
            p.oldY = p.y

            //Atualiza as posições X e Y com a velocidade
            p.x += vx
            p.y += vy

            //Detectando colisao nas bordas do canvas
            colisao(p, width, height, vx, vy)

            doWin()
        }
    }



    function renderPoints() {
        context.clearRect(0, 0, width, height)
        for(let i = 0; i < points.length; i++) {
            const p = points[i]
            context.beginPath();
            context.fillStyle = p.color
            context.arc(p.x, p.y, 25, 0, Math.PI * 2)
            context.fill()
        }
    }

    function renderBox() {
        for (let i = 0; i < box.length; i++) {
            const b = box[i]
            context.fillStyle = b.color
            context.fillRect(b.x, b.y, b.width, b.height)
        }
    }


    function colisao(p, width, height, vx, vy) {
        //Detectando colisão eixo x da borda do canvas
        if(p.x > width - 1) {
            p.color = getColor()

            p.x = width
            p.oldX = p.x + vx
        }
        else if(p.x < 0) {
            p.color = getColor()

            p.x = 0
            p.oldX = p.x + vx
        }

        //Detectando colisão eixo Y da borda do canvas
        if(p.y > height - 1) {
            alertPlayer("OOU NOOU!", " VOCÊ PERDEU")
        }
        else if(p.y < 0) {
            p.color = getColor()
            p.y = 0
            p.oldY = p.y + vy
        }

        playerColider(p, width, height, vx, vy)

        //Detectando colisão na box
        for (let i = 1; i < box.length; i++) {
            const b = box[i];

            //colisão lado esquerdo
            if(p.x >= b.x && p.y >= b.y && p.y <= (b.y + b.height) && p.x > 0 && p.x <= b.x + vx) {
                p.x = b.x
                p.oldX = b.x + vx
                box.splice(i, 1)
                score += 20    
                scoreText.textContent = score.toString();
            }

            //colisão lado direito
            if(p.x <= (b.x + b.width) && p.y >= b.y && p.y <= (b.y + b.height) && p.x >= (b.x + b.width) + vx && p.x < width) {
                p.x = (b.x + b.width)
                p.oldX = (b.x + b.width) + vx
                box.splice(i, 1)   
                score += 20
                scoreText.textContent = score.toString();
            }

            //colisão no topo
            if(p.y >= b.y && p.x >= b.x && p.x <= (b.x + b.width) && p.y > 0 && p.y <= b.y + vy) {
                p.y = b.y
                p.oldY = b.y + vy
                box.splice(i, 1)   
                score += 20
                scoreText.textContent = score.toString();
            }

            //colisão em baixo
            if(p.y <= (b.y + b.height) && p.x >= b.x && p.x <= (b.x + b.width) && p.y >= (b.y + b.height) + vy && p.y < height) {
                p.y = (b.y + b.height)
                p.oldY = (b.y + b.height) + vy
                box.splice(i, 1)   
                score += 20
                scoreText.textContent = score.toString();
            }
            
        }
    }


    function playerColider(p, width, height, vx, vy) {
        const b = box[0];

            //colisão lado esquerdo
            if(p.x >= b.x && p.y >= b.y && p.y <= (b.y + b.height) && p.x > 0 && p.x <= b.x + vx) {
                p.x = b.x
                p.oldX = b.x + vx     
            }

            //colisão lado direito
            if(p.x <= (b.x + b.width) && p.y >= b.y && p.y <= (b.y + b.height) && p.x >= (b.x + b.width) + vx && p.x < width) {
                p.x = (b.x + b.width)
                p.oldX = (b.x + b.width) + vx
            }

            //colisão no topo
            if(p.y >= b.y && p.x >= b.x && p.x <= (b.x + b.width) && p.y > 0 && p.y <= b.y + vy) {
                if(vy > 10){
                    vy = 10
                }
                b.color = getColor()
                p.y = b.y
                p.oldY = b.y + vy * 1.08
            }

            //colisão em baixo
            if(p.y <= (b.y + b.height) && p.x >= b.x && p.x <= (b.x + b.width) && p.y >= (b.y + b.height) + vy && p.y < height) {
                p.y = (b.y + b.height)
                p.oldY = (b.y + b.height) + vy
            }
    }


    function doMove(event) {
        if(event.buttons === 1) {
            event.stopPropagation()
            const b = box[0]
            if(event.offsetX > b.x && event.offsetX < (b.x + b.width)) {
                b.x = event.offsetX - (b.width / 2)
            }
        }
    }


    function getColor() {
        const a = hexa[Math.floor((Math.random() * 15) + 1) ],
              b = hexa[Math.floor((Math.random() * 15) + 1) ],
              c = hexa[Math.floor((Math.random() * 15) + 1) ],
              d = hexa[Math.floor((Math.random() * 15) + 1) ],
              e = hexa[Math.floor((Math.random() * 15) + 1) ],
              f = hexa[Math.floor((Math.random() * 15) + 1) ];
        return "#"+a+b+c+d+e+f;
    }

    function createBox() {
        box.push(
        { x: 10,  y: 10,  height: 20, width: 100, color: getColor() },
        { x: 115, y: 10, height: 20, width: 100, color: getColor() },
        { x: 220, y: 10, height: 20, width: 100, color: getColor() },
        { x: 327, y: 10, height: 20, width: 100, color: getColor() },
        { x: 434, y: 10, height: 20, width: 100, color: getColor() },
        
        { x: 490, y: 40, height: 20, width: 100, color: getColor() },
        { x: 380, y: 40, height: 20, width: 100, color: getColor() },
        { x: 270, y: 40, height: 20, width: 100, color: getColor() },
        { x: 160, y: 40, height: 20, width: 100, color: getColor() },
        { x: 50,  y: 40, height: 20, width: 100, color: getColor() },
        
        { x: 20,  y: 70,  height: 20, width: 100, color: getColor() },
        { x: 129, y: 70,  height: 20, width: 100, color: getColor() },
        { x: 236, y: 70,  height: 20, width: 100, color: getColor() },
        { x: 345, y: 70,  height: 20, width: 100, color: getColor() },
        { x: 457, y: 70,  height: 20, width: 100, color: getColor() },

        { x: 490, y: 105, height: 20, width: 100, color: getColor() },
        { x: 380, y: 105, height: 20, width: 100, color: getColor() },
        { x: 270, y: 105, height: 20, width: 100, color: getColor() },
        { x: 160, y: 105, height: 20, width: 100, color: getColor() },
        { x: 50,  y: 105, height: 20, width: 100, color: getColor() },

        { x: 20,  y: 135,  height: 20, width: 100, color: getColor() },
        { x: 129, y: 135,  height: 20, width: 100, color: getColor() },
        { x: 236, y: 135,  height: 20, width: 100, color: getColor() },
        { x: 345, y: 135,  height: 20, width: 100, color: getColor() },
        { x: 457, y: 135,  height: 20, width: 100, color: getColor() },
        )
    }

    function doWin() {
        if(box.length === 1){
            alertPlayer("PARABÉNS!", "VOCÊ VENCEU")
        }
    }


    function alertPlayer(title, message) {
        document.querySelector("body").style.background = "#000";
        points[0].x = 0;
        points[0].y = 0;
        points[0].oldX = 0;
        points[0].oldY = 0;
        points[0].color = "#000";
        alertTitle.textContent = title
        alertMessage.textContent = message
        alertContainer.style.visibility = "visible"

    }
}


function resetPage() {
    window.location.reload()
}