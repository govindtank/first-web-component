const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/3
class ChordArcComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0,0,size,size)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class ChordArc {
    constructor(i) {
        this.i = i
    }
    draw(context) {
        context.save()
        context.translate(size/2,size/2)
        context.beginPath()
        for(var i = -45;i<=45;i++) {
            const x = (size/3)*Math.cos(i*Math.PI/180),y = (size/3)*Math.sin(i*Math.PI/180)
            if(i == -45) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }

}