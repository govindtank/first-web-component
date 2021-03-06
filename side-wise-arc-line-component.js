const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/2
class SideWiseArcLineComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.container = new SideWiseArcLineContainer()
        this.animator = new Animator(this)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#f44336'
        context.strokeStyle = context.fillStyle
        context.lineWidth = size/60
        context.lineCap = 'round'
        this.container.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            this.container.handleTap(event.offsetX,event.offsetY,this.animator.startAnimation)
        }
    }
}
class SideWiseArcLine {
    constructor(i) {
        this.i = i
        this.x = (this.i%2)*(0.65*size)+size*0.15
        this.y = i*0.2*size+0.15*size
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.lineWidth = 0.01*size
        context.beginPath()
        context.arc(0,0,0.1*size,0,2*Math.PI)
        context.stroke()
        context.beginPath()
        context.moveTo(0,0)
        for(var i=0;i<=360*this.state.scale;i++) {
            const x = 0.1*size*Math.cos(i*Math.PI/180), y = 0.1*size*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
        }
        context.fill()
        context.restore()
        const diff = (this.x-0.5*size)
        context.save()
        context.translate(0.5*size,this.y)
        context.beginPath()
        context.moveTo(diff*(1-this.state.scale),0)
        context.lineTo(diff,0)
        context.stroke()
        context.restore()
    }
    update() {
        this.state.update()
    }
    stopped() {
        return this.state.stopped()
    }
    handleTap(x,y) {
        return x>=this.x - 0.1*size && x<=this.x+0.1*size && y>=this.y-0.1*size && y<=this.y + 0.1*size && this.state.stopped()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.deg = 0
    }
    update() {
        this.scale = Math.sin(this.deg*Math.PI/180)
        this.deg+=4.5
        if(this.deg > 180) {
            this.deg = 0
            this.scale = 0
        }
    }
    stopped() {
        return this.deg == 0
    }
}
class SideWiseArcLineContainer {
    constructor(component) {
        this.arcLines = []
        this.init()
        this.component = component
        this.updatingLines = []
    }
    init() {
        for(var i=0;i<4;i++) {
            this.arcLines.push(new SideWiseArcLine(i))
        }
    }
    draw(context){
        this.arcLines.forEach((arcLine)=>{
            arcLine.draw(context)
        })
    }
    update(stopcb) {
        this.updatingLines.forEach((line,index)=>{
            line.update()
            if(line.stopped()) {
                this.updatingLines.splice(index,1)
                if(this.updatingLines.length == 0) {
                    stopcb()
                }
            }
        })
    }
    handleTap(x,y,startcb) {
        this.arcLines.forEach((arcLine)=>{
            if(arcLine.handleTap(x,y)) {
                this.updatingLines.push(arcLine)
                if(this.updatingLines.length == 1) {
                    startcb()
                }
            }
        })
    }
}
class Animator {
    constructor(component) {
        this.component = component
        this.animated = false
        this.startAnimation = this.startAnimation.bind(this)
        this.stopAnimation = this.stopAnimation.bind(this)
    }
    startAnimation() {
        if(!this.animated) {
            console.log(this.component.container)
            this.animated = true
            this.interval = setInterval(()=>{
                this.component.render()
                this.component.container.update(this.stopAnimation)
            },75)
        }
    }
    stopAnimation() {
        this.animated = false
        clearInterval(this.interval)
        this.component.render()
    }
}
customElements.define('side-wise-arc-line',SideWiseArcLineComponent)
