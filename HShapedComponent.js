const w = window.innerWidth, h = window.innerHeight
class HShapedComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('canvas')
        const shadow = this.attachShadow({mode : 'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class HShapeState {
    constructor() {
        this.scales = [0, 0]
        this.prevScale = 0
        this.dir = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += this.dir * 0.1
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}
