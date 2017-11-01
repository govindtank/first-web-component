const w = canvas.width,h = canvas.height,size = Math.min(w,h)/2
class CenterToCornerRectComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement(img)
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}