const
    initSpeed = 10, // условная скорость самых ближних снежинок
    minSpeed = 5, // условная скорость самых дальних снежинок
    maxParallaxDecline = 50, // максимальное смещение ближних снежинок
    snowMaxAmount = 3000,// максимальное количество снежинок
    initDiam = 15, // дефолтный диаметр, от которого расчитывается диаметр каждой снежинки
    minDiamPercentage = 0.35, // минимальное отношение самых дальних снежинок к самым ближним

    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', (e) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

class Snowflake {
    constructor () {
        this.depth = Math.ceil(Math.random() * 10) / 10
				this.speed = ((Math.random() * (initSpeed - minSpeed)) + minSpeed) * (this.depth + 0.5)
				this.diam = this.depth * (initDiam - minDiamPercentage * initDiam) + minDiamPercentage * initDiam
				this.xPos = (Math.random() * (canvas.width + 200)) - 100
				this.yPosStart = Snowflake.yPos
				this.yPos = 0
    }

    static moveY () {
        Snowflake.yPos++
    }

    static declineX (val) {
        Snowflake.xDecline = val
    }

    resetFlake () {
        this.yPosStart = Snowflake.yPos,
            this.xPos = (Math.random() * (canvas.width + 200)) - 100,
            this.diam = this.depth * (initDiam - 2) + 2,
            this.yPos = 0
    }

    fall() {
        if (this.yPos > canvas.height) {
            this.resetFlake()
        } else {
            this.yPos = (Snowflake.yPos - this.yPosStart) * this.speed
        }

        const x = this.xPos + (this.yPos * (Math.sin(this.xPos) / this.speed))

        context.beginPath();
        context.fillStyle = '#ffffff';
        context.arc(x + (Snowflake.xDecline * (this.depth + 0.3)), this.yPos, this.diam, 0, 2 * Math.PI);
        context.fill();
    }
}
Snowflake.yPos = 0
Snowflake.xDecline = 0

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX
    const center = canvas.width / 2
    const distance = mouseX - center
    const reversed = distance < 0
    const percentage = Math.abs(distance) / center
    const finalDecline = percentage * maxParallaxDecline * (reversed ? 1 : -1)

    Snowflake.declineX(finalDecline)
})

const flakes = []

function launch () {
    if (flakes.length < snowMaxAmount) {
        flakes.push(new Snowflake)
    }
    context.clearRect(0, 0, canvas.width, canvas.height)
    flakes.forEach(flake => flake.fall())
    Snowflake.yPos++
    requestAnimationFrame(launch)
}

launch()
