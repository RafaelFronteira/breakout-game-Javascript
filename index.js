window.onload = function () {
    const hexa = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"]
    const canvasContainer = document.getElementById("canvasContainer")
    const scoreText = document.getElementById("point")
    const alertContainer = document.getElementById("alertContainer")
    const alertTitle = document.getElementById("alertTitle")
    const alertMessage = document.getElementById("alertMessage")
    const canvas = document.createElement("canvas")
    const levelText = document.getElementById("level")
    let context = canvas.getContext("2d"),
        score = 0
    width = canvas.width = canvasContainer.offsetWidth,
        height = canvas.height = 400,
        level = 1,
        typeScreen = { xs: false, xSmall: false, small: false, middle: false, large: false, xLarge: false }

    canvas.style.border = "1px solid #000"

    scoreText.textContent = score.toString()
    levelText.textContent = level.toString()
    canvasContainer.appendChild(canvas)

    let points = [],
        box = [];

    if (width < 340) {
        typeScreen.xs = true

        createPlayer()
        createBall(135, 305, 13)
        createBox()

    } else if (width >= 340 && width < 544) {
        typeScreen.xSmall = true

        createPlayer()
        createBall(135, 305, 13)
        createBox()
    }
    else if (width >= 544 && width < 601) {
        typeScreen.small = true

        createPlayer()
        createBall(135, 305, 13)
        createBox()
    }
    

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
        if (event.buttons === 1) {
            const b = box[0]
            if (event.offsetX > b.x && event.offsetX < (b.x + b.width)) {
                b.x = event.offsetX - (b.width / 2)
                if(b.x > width - 5) {
                    b.x = width
                    console.log("Bx => ",b.x)
                }
                if(b.x < 0 ){
                    b.x = 0
                }
            }
        }
    }

    function handlerTouch(event) {
        event.preventDefault();
        const b = box[0]
        const touch = event.changedTouches;

        b.x = touch[0].pageX - ((b.x + b.width) / 3)
        if(b.x > width) {
            b.x = width
        }
        if(b.x < 0 ){
            b.x = 0
        }
    }

    function createPlayer() {
            box[0] = {
                x: 100,
                y: 365,
                height: 25,
                width: 125,
                color: getColor()
            }
       
    }

    function createBall(x, y, d) {
        points.push({
            x: x,
            y: y,
            d: d,
            oldX: x - 3,
            oldY: y - 3,
            color: getColor()
        })
    }

    function updatePoints() {
        for (let i = 0; i < points.length; i++) {
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
        for (let i = 0; i < points.length; i++) {
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
        if (p.x > width - 1) {
            p.color = getColor()

            p.x = width
            p.oldX = p.x + vx
        }
        else if (p.x < 0) {
            p.color = getColor()

            p.x = 0
            p.oldX = p.x + vx
        }

        //Detectando colisão eixo Y da borda do canvas
        if (p.y > height - 1) {
            alertPlayer("OOU NOOU!", " Fim de jogo")
        }
        else if (p.y < 0) {
            p.color = getColor()
            p.y = 0
            p.oldY = p.y + vy
        }

        playerColider(p, width, height, vx, vy)

        //Detectando colisão na box
        for (let i = 1; i < box.length; i++) {
            const b = box[i];

            //colisão lado esquerdo
            if (p.x >= b.x && p.y >= b.y && p.y <= (b.y + b.height) && p.x > 0 && p.x <= b.x + vx) {
                p.x = b.x
                p.oldX = b.x + vx
                box.splice(i, 1)
                score += 20
                scoreText.textContent = score.toString();
            }
            else if (p.x <= (b.x + b.width) && p.y >= b.y && p.y <= (b.y + b.height) && p.x >= (b.x + b.width) + vx && p.x < width) {
                p.x = (b.x + b.width)
                p.oldX = (b.x + b.width) + vx
                box.splice(i, 1)
                score += 20
                scoreText.textContent = score.toString();
            }
            else if (p.y >= b.y && p.x >= b.x && p.x <= (b.x + b.width) && p.y > 0 && p.y <= b.y + vy) {
                p.y = b.y
                p.oldY = b.y + vy
                box.splice(i, 1)
                score += 20
                scoreText.textContent = score.toString();
            }
            else if (p.y <= (b.y + b.height) && p.x >= b.x && p.x <= (b.x + b.width) && p.y >= (b.y + b.height) + vy && p.y < height) {
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
        if (p.x >= b.x && p.y >= b.y && p.y <= (b.y + b.height) && p.x > 0 && p.x <= b.x + vx) {
            p.x = b.x
            p.oldX = b.x + vx
        }

        //colisão lado direito
        if (p.x <= (b.x + b.width) && p.y >= b.y && p.y <= (b.y + b.height) && p.x >= (b.x + b.width) + vx && p.x < width) {
            p.x = (b.x + b.width)
            p.oldX = (b.x + b.width) + vx
        }

        //colisão no topo
        if (p.y >= b.y && p.x >= b.x && p.x <= (b.x + b.width) && p.y > 0 && p.y <= b.y + vy) {
            if (vy > 30) {
                vy = 30
            }
            b.color = getColor()
            p.y = b.y
            p.oldY = b.y + (vy * 1.02)
        }

        //colisão em baixo
        if (p.y <= (b.y + b.height) && p.x >= b.x && p.x <= (b.x + b.width) && p.y >= (b.y + b.height) + vy && p.y < height) {
            p.y = (b.y + b.height)
            p.oldY = (b.y + b.height) + vy
        }
    }

    function getColor() {
        const a = hexa[Math.floor((Math.random() * 15) + 1)],
            b = hexa[Math.floor((Math.random() * 15) + 1)],
            c = hexa[Math.floor((Math.random() * 15) + 1)],
            d = hexa[Math.floor((Math.random() * 15) + 1)],
            e = hexa[Math.floor((Math.random() * 15) + 1)],
            f = hexa[Math.floor((Math.random() * 15) + 1)];
        return "#" + a + b + c + d + e + f;
    }

    function createBox() {
        if (typeScreen.xs) {
            box.push(
                { x: 5, y: 10, height: 20, width: 50, color: getColor() },
                { x: width / 5, y: 10, height: 20, width: 50, color: getColor() },
                { x: width / 2.3, y: 10, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 10, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 10, height: 20, width: 50, color: getColor() },

                { x: 10, y: 40, height: 20, width: 50, color: getColor() },
                { x: width / 4, y: 40, height: 20, width: 50, color: getColor() },
                { x: width / 2.2, y: 40, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 40, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 40, height: 20, width: 50, color: getColor() },

                { x: 5, y: 70, height: 20, width: 50, color: getColor() },
                { x: width / 5, y: 70, height: 20, width: 50, color: getColor() },
                { x: width / 2.3, y: 70, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 70, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 70, height: 20, width: 50, color: getColor() },

                { x: 10, y: 100, height: 20, width: 50, color: getColor() },
                { x: width / 4, y: 100, height: 20, width: 50, color: getColor() },
                { x: width / 2.2, y: 100, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 100, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 100, height: 20, width: 50, color: getColor() },

                { x: 5, y: 130, height: 20, width: 50, color: getColor() },
                { x: width / 5, y: 130, height: 20, width: 50, color: getColor() },
                { x: width / 2.3, y: 130, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 130, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 130, height: 20, width: 50, color: getColor() },

                { x: 10, y: 160, height: 20, width: 50, color: getColor() },
                { x: width / 4, y: 160, height: 20, width: 50, color: getColor() },
                { x: width / 2.2, y: 160, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 160, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 160, height: 20, width: 50, color: getColor() },
            )
        }
        else if (typeScreen.xSmall) {
            box.push(
                { x: 5, y: 10, height: 20, width: 50, color: getColor() },
                { x: width / 5, y: 10, height: 20, width: 50, color: getColor() },
                { x: width / 2.3, y: 10, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 10, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 10, height: 20, width: 50, color: getColor() },

                { x: 10, y: 40, height: 20, width: 50, color: getColor() },
                { x: width / 4, y: 40, height: 20, width: 50, color: getColor() },
                { x: width / 2.2, y: 40, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 40, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 40, height: 20, width: 50, color: getColor() },

                { x: 5, y: 70, height: 20, width: 50, color: getColor() },
                { x: width / 5, y: 70, height: 20, width: 50, color: getColor() },
                { x: width / 2.3, y: 70, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 70, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 70, height: 20, width: 50, color: getColor() },

                { x: 10, y: 100, height: 20, width: 50, color: getColor() },
                { x: width / 4, y: 100, height: 20, width: 50, color: getColor() },
                { x: width / 2.2, y: 100, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 100, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 100, height: 20, width: 50, color: getColor() },

                { x: 5, y: 130, height: 20, width: 50, color: getColor() },
                { x: width / 5, y: 130, height: 20, width: 50, color: getColor() },
                { x: width / 2.3, y: 130, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 130, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 130, height: 20, width: 50, color: getColor() },

                { x: 10, y: 160, height: 20, width: 50, color: getColor() },
                { x: width / 4, y: 160, height: 20, width: 50, color: getColor() },
                { x: width / 2.2, y: 160, height: 20, width: 50, color: getColor() },
                { x: width - 110, y: 160, height: 20, width: 50, color: getColor() },
                { x: width - 50, y: 160, height: 20, width: 50, color: getColor() },
            )
        }
        else if (typeScreen.small) {
            box.push(
                { x: (width / width) + 5, y: 10, height: 20, width: 100, color: getColor() },
                { x: width / 5, y: 10, height: 20, width: 100, color: getColor() },
                { x: (width / 3.3) + 50, y: 10, height: 20, width: 100, color: getColor() },
                { x: (width / 1.7), y: 10, height: 20, width: 100, color: getColor() },
                { x: width - 110, y: 10, height: 20, width: 100, color: getColor() },

                { x: 20, y: 40, height: 20, width: 100, color: getColor() },
                { x: width / 4, y: 40, height: 20, width: 100, color: getColor() },
                { x: (width / 3.2) + 80, y: 40, height: 20, width: 100, color: getColor() },
                { x: (width / 1.6) + 10, y: 40, height: 20, width: 100, color: getColor() },
                { x: width - 90, y: 40, height: 20, width: 100, color: getColor() },

                { x: (width / width) + 5, y: 70, height: 20, width: 100, color: getColor() },
                { x: width / 5, y: 70, height: 20, width: 100, color: getColor() },
                { x: (width / 3.3) + 50, y: 70, height: 20, width: 100, color: getColor() },
                { x: (width / 1.7), y: 70, height: 20, width: 100, color: getColor() },
                { x: width - 110, y: 70, height: 20, width: 100, color: getColor() },

                { x: 20, y: 100, height: 20, width: 100, color: getColor() },
                { x: width / 4, y: 100, height: 20, width: 100, color: getColor() },
                { x: (width / 3.2) + 80, y: 100, height: 20, width: 100, color: getColor() },
                { x: (width / 1.6) + 10, y: 100, height: 20, width: 100, color: getColor() },
                { x: width - 90, y: 100, height: 20, width: 100, color: getColor() },

                { x: (width / width) + 5, y: 130, height: 20, width: 100, color: getColor() },
                { x: width / 5, y: 130, height: 20, width: 100, color: getColor() },
                { x: (width / 3.3) + 50, y: 130, height: 20, width: 100, color: getColor() },
                { x: (width / 1.7), y: 130, height: 20, width: 100, color: getColor() },
                { x: width - 110, y: 130, height: 20, width: 100, color: getColor() },

                { x: 20, y: 160, height: 20, width: 100, color: getColor() },
                { x: width / 4, y: 160, height: 20, width: 100, color: getColor() },
                { x: (width / 3.2) + 80, y: 160, height: 20, width: 100, color: getColor() },
                { x: (width / 1.6) + 10, y: 160, height: 20, width: 100, color: getColor() },
                { x: width - 90, y: 160, height: 20, width: 100, color: getColor() },

            )
        } 
        else if (typeScreen.middle) {

        } 
        else if (typeScreen.large) {

        }
        else if (typeScreen.xLarge) {

        }
    }

    function doWin() {
        if (box.length === 1) {
            level++
            levelText.textContent = level.toString()

            if (typeScreen.xs) {
                createBox()
                createPlayer()

                points[0] = {
                    x: 135,
                    y: 305,
                    d: 13,
                    oldX: 132,
                    oldY: 302
                }
                if (level === 3) {
                    createBall(130, 305, 13)
                }
                else if (level === 15) {
                    createBall(133, 305, 13)
                }
                else if (level === 25) {
                    createBall(129, 305, 13)
                }
                else if (level === 35) {
                    createBall(130, 305, 13)
                }
                else if (level === 50) {
                    createBall(135, 305, 13)
                }
            }
            else if (typeScreen.xSmall) {
                createBox()
                createPlayer()

                points[0] = {
                    x: 135,
                    y: 305,
                    d: 13,
                    oldX: 132,
                    oldY: 302
                }

                if (level === 3) {
                    createBall(130, 305, 13)
                }
                else if (level === 15) {
                    createBall(133, 305, 13)
                }
                else if (level === 25) {
                    createBall(129, 305, 13)
                }
                else if (level === 35) {
                    createBall(130, 305, 13)
                }
                else if (level === 50) {
                    createBall(135, 305, 13)
                }

            }
            else if (typeScreen.small) {
                    createBox()
                    createPlayer()

                    points[0] = {
                        x: 135,
                        y: 305,
                        d: 13,
                        oldX: 132,
                        oldY: 302
                    }


                    if (level === 3) {
                        createBall(130, 305, 13)
                    }
                    else if (level === 15) {
                        createBall(133, 305, 13)
                    }
                    else if (level === 25) {
                        createBall(129, 305, 13)
                    }
                    else if (level === 35) {
                        createBall(130, 305, 13)
                    }
                    else if (level === 50) {
                        createBall(135, 305, 13)
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

        if (!title == "Ops...") {
            const p = document.createElement("p")
            p.textContent = "Score: " + score
            alertContainer.appendChild(p)
        }
    }
}


function resetPage() {
    window.location.reload()
}