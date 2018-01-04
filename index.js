window.onload = function () {
    const hexa = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]
    const canvasContainer = document.getElementById("canvasContainer")
    const scoreText = document.getElementById("point")
    const alertContainer = document.getElementById("alertContainer")
    const alertTitle = document.getElementById("alertTitle")
    const alertMessage = document.getElementById("alertMessage")
    const canvas = document.createElement("canvas")
    const levelText = document.getElementById("level")
    let context =  canvas.getContext("2d"),
        score = 0 
        width = canvas.width = canvasContainer.offsetWidth,
        height = canvas.height = 500,
        level = 1,
        isMobile = false

    canvas.style.border = "1px solid #000"

    scoreText.textContent = score.toString()
    levelText.textContent = level.toString()
    canvasContainer.appendChild(canvas)

    let points = [],
       box = [];

    console.log("Width => ", width)


    if(width >= 300 && width <= 500) {  
        isMobile = true

        box.push({
            x: 100,
            y: 465,
            height: 30,
            width: 125,
            color: getColor()
        });

        points.push({
            x: 135,
            y: 445,
            d: 15,
            oldX: 130,
            oldY: 440,
            color: getColor()
        })
        
    } else {
        alertPlayer("Ops...", "Ainda estou desenvolvendo para seu dispositivo :)")
    }
  


    createBox()


    canvas.addEventListener("mousemove", handlerClick)
    canvas.addEventListener("touchmove", handlerTouch)

    update()

    function update() {
        updatePoints()
        renderPoints()
        renderBox()
        requestAnimationFrame(update)
    }

    
    function handlerClick(event) {
        event.preventDefault()
        if(event.buttons === 1) {
            const b = box[0]
            if(event.offsetX > b.x && event.offsetX < (b.x + b.width)) {
                b.x = event.offsetX - (b.width / 2)
            }
        }
    }

    function handlerTouch(event) {
        event.preventDefault();
        const b = box[0]
        const touch = event.changedTouches;

        if(touch[0].pageX < (b.x + b.width+10) ) {
            b.x = touch[0].pageX - (b.width / 7)
        }
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
            context.arc(p.x, p.y, p.d, 0, Math.PI * 2)
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
            alertPlayer("OOU NOOU!", " Fim de jogo")
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
            else if(p.x <= (b.x + b.width) && p.y >= b.y && p.y <= (b.y + b.height) && p.x >= (b.x + b.width) + vx && p.x < width) {
                p.x = (b.x + b.width)
                p.oldX = (b.x + b.width) + vx
                box.splice(i, 1)   
                score += 20
                scoreText.textContent = score.toString();
            }
            else if(p.y >= b.y && p.x >= b.x && p.x <= (b.x + b.width) && p.y > 0 && p.y <= b.y + vy) {
                p.y = b.y
                p.oldY = b.y + vy
                box.splice(i, 1)   
                score += 20
                scoreText.textContent = score.toString();
            }
            else if(p.y <= (b.y + b.height) && p.x >= b.x && p.x <= (b.x + b.width) && p.y >= (b.y + b.height) + vy && p.y < height) {
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
                if(vy > 30) {
                    vy = 30
                }
                b.color = getColor()
                p.y = b.y
                p.oldY = b.y + (vy * 1.07879)
            }

            //colisão em baixo
            if(p.y <= (b.y + b.height) && p.x >= b.x && p.x <= (b.x + b.width) && p.y >= (b.y + b.height) + vy && p.y < height) {
                p.y = (b.y + b.height)
                p.oldY = (b.y + b.height) + vy
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
        if(isMobile) {
            box.push(   
                { x: (width/width) + 5, y: 10, height: 20, width: 100, color: getColor()},
                { x: width/2.3,         y: 10, height: 20, width: 100, color: getColor()},
                { x: width-110,         y: 10, height: 20, width: 100, color: getColor()},

                { x: 20,           y: 40, height: 20, width: 100, color: getColor()},
                { x: width/2.9,    y: 40, height: 20, width: 100, color: getColor()},
                { x: width-150,    y: 40, height: 20, width: 100, color: getColor()},

                { x: (width/width) + 5, y: 70, height: 20, width: 100, color: getColor()},
                { x: width/2.3,         y: 70, height: 20, width: 100, color: getColor()},
                { x: width-110,         y: 70, height: 20, width: 100, color: getColor()},

                { x: 20,           y: 100, height: 20, width: 100, color: getColor()},
                { x: width/2.9,    y: 100, height: 20, width: 100, color: getColor()},
                { x: width-150,    y: 100, height: 20, width: 100, color: getColor()},

                { x: (width/width) + 5, y: 130, height: 20, width: 100, color: getColor()},
                { x: width/2.3,         y: 130, height: 20, width: 100, color: getColor()},
                { x: width-110,         y: 130, height: 20, width: 100, color: getColor()},

                { x: 20,           y: 160, height: 20, width: 100, color: getColor()},
                { x: width/2.9,    y: 160, height: 20, width: 100, color: getColor()},
                { x: width-150,    y: 160, height: 20, width: 100, color: getColor()},
            )
        }
        else {
            box.push(   
                { x: 003, y: 10, height: 20, width: 100, color: getColor()},
                { x: 120, y: 10, height: 20, width: 100, color: getColor()},
                { x: 250, y: 10, height: 20, width: 100, color: getColor()},
                { x: 250, y: 10, height: 20, width: 100, color: getColor()},

                { x: 010, y: 40, height: 20, width: 100, color: getColor()},
                { x: 160, y: 40, height: 20, width: 100, color: getColor()},
                { x: 280, y: 40, height: 20, width: 100, color: getColor()},
                { x: 280, y: 40, height: 20, width: 100, color: getColor()},
            )
        }
    }

    function doWin() {
        if(box.length === 1) {
            level++
            levelText.textContent = level.toString()

            if(isMobile) {
                createBox()

                box[0] = {
                    x: 100,
                    y: 465,
                    height: 30,
                    width: 125,
                    color: getColor()
                }
        
                points[0] = {
                    x: 120,
                    y: 445,
                    d: 15,
                    oldX: 115,
                    oldY: 440,
                    color: getColor()
                }

                if(level === 3) {
                    points.push({
                        x: 130,
                        y: 445,
                        d: 15,
                        oldX: 125,
                        oldY: 440,
                        color: getColor()
                    })
                }
                else if (level === 15) {
                    points.push({
                        x: 133,
                        y: 445,
                        d: 15,
                        oldX: 129,
                        oldY: 440,
                        color: getColor()
                    })
                }
                else if (level === 25) {
                    points.push({
                        x: 129,
                        y: 445,
                        d: 15,
                        oldX: 134,
                        oldY: 440,
                        color: getColor()
                    })
                }
                else if (level === 35) {
                    points.push({
                        x: 130,
                        y: 545,
                        d: 15,
                        oldX: 125,
                        oldY: 540,
                        color: getColor()
                    })
                }
                else if (level === 50) {
                    points.push({
                        x: 135,
                        y: 445,
                        d: 15,
                        oldX: 130,
                        oldY: 440,
                        color: getColor()
                    })
                }

    
            } else {
                box[0] = {
                    x: 250,
                    y: 450,
                    height: 40,
                    width: 205,
                    color: getColor()
                }
    
                points[0] = {
                    x: 290,
                    y: 445,
                    oldX: 285,
                    oldY: 440,
                    color: getColor()
                }
            }
        }
    }


    function alertPlayer(title, message) {
        document.querySelector("body").style.background = "#000";
        for (let i = 0; i < points.length; i++) {
            points[i].x = 0;
            points[i].y = 0;
            points[i].oldX = 0;
            points[i].oldY = 0;
            points[i].color = "#000";
            
        }

        alertTitle.textContent = title
        alertMessage.textContent = message
        alertContainer.style.visibility = "visible"

        if(!title === "Ops...") {
            const p = document.createElement("p")
            p.textContent = "Score: "+score
            alertContainer.appendChild(p)
        }
    }

}

function resetPage() {
    window.location.reload()
}