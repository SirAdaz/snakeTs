window.onload = function() {
    const canvasWidth: number = 900;
    const canvasHeight: number = 600;
    const blockSize: number = 30;
    let ctx: CanvasRenderingContext2D | null;
    const delay: number = 100;
    const widthInBlocks: number = canvasWidth / blockSize;
    const heightInBlocks: number = canvasHeight / blockSize;
    let snakee: Snake;
    let applee: Apple; 
    let score: number;
    let timeOut: number;

    init();

    function init(): void {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas(): void {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition(); 
                } while (applee.isOnSnake(snakee));
            }
            ctx!.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = window.setTimeout(refreshCanvas, delay);
        }
    }

    function gameOver(): void {
        if (!ctx) return;
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        const centreX = canvasWidth / 2;
        const centreY = canvasHeight / 2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    function restart(): void {
        snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore(): void {
        if (!ctx) return;
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const centreX = canvasWidth / 2;
        const centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx: CanvasRenderingContext2D, position: [number, number]): void {
        const x: number = position[0] * blockSize;
        const y: number = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    class Snake {
        body: [number, number][];
        direction: string;
        ateApple: boolean;

        constructor(body: [number, number][], direction: string) {
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
        }

        draw(): void {
            if (!ctx) return;
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        }

        advance(): void {
            const nextPosition: [number, number] = this.body[0].slice() as [number, number];
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw new Error("invalid direction");
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        }

        setDirection(newDirection: string): void {
            let allowedDirections: string[];
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw new Error("invalid direction");
            }
            if (allowedDirections.includes(newDirection)) {
                this.direction = newDirection;
            }
        }

        checkCollision(): boolean {
            const head: [number, number] = this.body[0];
            const rest: [number, number][] = this.body.slice(1);
            const snakeX: number = head[0];
            const snakeY: number = head[1];
            const minX: number = 0;
            const minY: number = 0;
            const maxX: number = widthInBlocks - 1;
            const maxY: number = heightInBlocks - 1;
            const isNotBetweenHorizontalWalls: boolean = snakeX < minX || snakeX > maxX;
            const isNotBetweenVerticalWalls: boolean = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                return true;
            }

            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                    return true;
                }
            }

            return false;
        }

        isEatingApple(appleToEat: Apple): boolean {
            const head: [number, number] = this.body[0];
            return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
        }
    }

    class Apple {
        position: [number, number];

        constructor(position: [number, number]) {
            this.position = position;
        }

        draw(): void {
            if (!ctx) return;
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            const radius = blockSize / 2;
            const x = this.position[0] * blockSize + radius;
            const y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        }

        setNewPosition(): void {
            const newX: number = Math.round(Math.random() * (widthInBlocks - 1));
            const newY: number = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }

        isOnSnake(snakeToCheck: Snake): boolean {
            return snakeToCheck.body.some(([x, y]) => this.position[0] === x && this.position[1] === y);
        }
    }

    document.onkeydown = function handleKeyDown(e: KeyboardEvent): void {
        const key: number = e.keyCode;
        let newDirection: string | undefined;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    };
}
