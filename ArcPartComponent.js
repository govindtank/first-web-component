const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h)/3
class ArcPartComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        const n = this.getAttribute('n') || 6
        shadow.appendChild(this.img)
        this.animator = new Animator()
        this.arcPartContainer = new ArcPartContainer(n)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, w, h)
        context.strokeStyle = '#FF5722'
        context.lineWidth = size/10
        context.lineCap = 'round'
        this.arcPartContainer.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.arcPartContainer.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.arcPartContainer.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            console.log("started")
            this.dir = 1 - 2 * this.prevScale
            startcb()
            console.log(this.dir)
        }
    }
}
class ContainerState {
    constructor(n) {
        this.j = 0
        this.dir = 1
        this.n = n
    }
    incrementCounter() {
        this.j += this.dir
        if (this.j == this.n || this.j == -1) {
            this.dir *= -1
            this.j += this.dir
        }
    }
    execute(cb) {
        if(this. j < this.n) {
            cb(this.j)
        }
    }
}
class ArcPart {
    constructor(i) {
        this.state = new State()
        this.i = i
    }
    draw(context, deg) {
        context.save()
        context.translate(-size *(1 - this.state.scale), 0)
        context.rotate(this.i * deg * (Math.PI/180) * this.state.scale)
        context.beginPath()
        for (var i = 0; i < deg * this.state.scale; i++) {
            const x = size * Math.cos(i * Math.PI/180), y = size * Math.sin(i * Math.PI/180)
            if (i == 0) {
                context.moveTo(x, y)
            }
            else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class ArcPartContainer {
    constructor(n) {
        this.n = n
        this.containerState = new ContainerState(n)
        this.initArcParts()
    }
    initArcParts() {
        this.arcParts = []
        for (var i = 0; i< this.n; i++) {
            this.arcParts.push(new ArcPart(i))
        }
    }
    draw(context) {
        if (this.n > 0) {
            context.save()
            context.translate(w/2, h/2)
            this.arcParts.forEach((arcPart) => {
                arcPart.draw(context, 360/this.n)
            })
            context.restore()
        }
    }
    update(stopcb) {
        this.containerState.execute((j) => {
            console.log(this.arcParts[j].state.scale)
            this.arcParts[j].update(() => {
                this.containerState.incrementCounter()
                stopcb()
                console.log(this.containerState.j)
            })
        })
    }
    startUpdating(startcb) {
        this.containerState.execute((j) => {
            this.arcParts[j].startUpdating(startcb)
        })
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            console.log("anim started")
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('arc-part-comp', ArcPartComponent)
