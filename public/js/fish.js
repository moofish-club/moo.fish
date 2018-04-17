function FishNode(ctx) {
    this.ctx = ctx
    this.angle = 0
    this.x = 0
    this.y = 0
    this.color = "0,0,0"
}
FishNode.prototype.draw = function() {}

function FishHead(ctx, headSize) {
    FishNode.call(this, ctx)
    this.headSize = headSize
}

FishHead.prototype.draw = function() {
    this.ctx.save()
    this.ctx.rotate(90 * Math.PI / 180)
    var headStyle = 'rgba('+this.color+', 1)'
    this.ctx.fillStyle = headStyle
    this.ctx.beginPath()
    this.ctx.moveTo(-this.headSize/2, 0)
    this.ctx.bezierCurveTo(-this.headSize / 5, -this.headSize*0.2,
        this.headSize/5, -this.headSize*0.2,
        this.headSize/2, 0)
    this.ctx.lineTo(this.headSize/2, this.headSize * 0.3)
    this.ctx.bezierCurveTo(this.headSize / 5, this.headSize*0.1,
        - this.headSize / 5, this.headSize*0.1,
        - this.headSize / 2, this.headSize*0.3)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
}

function FishBody(ctx, bodySize) {
    FishNode.call(this, ctx)
    this.bodySize = bodySize
}
FishBody.prototype.draw = function() {
    this.ctx.save()
    this.ctx.fillStyle = 'rgba('+this.color+',1)'
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.bodySize, 0, Math.PI*2, true)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
}

function FishFin(ctx, finSize) {
    this.ctx = ctx
    this.finSize = finSize
}

FishFin.prototype.draw = function() {
    this.ctx.save();
    this.ctx.translate(this.finSize, 0)
    this.ctx.rotate(90 * Math.PI / 180)
    this.ctx.fillStyle = 'rgba(0,0,0,1)'
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(this.finSize, 1.5*this.finSize)
    this.ctx.lineTo(0, this.finSize)
    this.ctx.lineTo(-this.finSize, 1.5*this.finSize)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
}

function FishTail(ctx, tailSize) {
    FishNode.call(this, ctx)
    this.tailSize = tailSize
}
FishTail.prototype.draw = function() {
    this.ctx.save()
    this.ctx.translate(this.tailSize*0.3, 0)
    this.ctx.rotate(90 * Math.PI / 180)
    this.ctx.fillStyle = 'rgba(0,0,0,1)'
    this.ctx.beginPath()
    this.ctx.moveTo(-this.tailSize, 1.8*this.tailSize)
    this.ctx.lineTo(0, this.tailSize)
    this.ctx.lineTo(this.tailSize, 1.8*this.tailSize)
    this.ctx.quadraticCurveTo(this.tailSize*0.1, 0,0,0)
    this.ctx.quadraticCurveTo(-this.tailSize*0.1, 0,-this.tailSize, 1.8*this.tailSize)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.restore()
}

function Fish(ctx) {
    this.ctx = ctx
    
    // location
    this.x = 0
    this.y = 0
    
    // angle for chasing the pointer
    this.angle = 0
    
    this.fishNodes = new Array()
    
    this.speed = 1
    this.agility = 6
    this.scale = 0.5
    this.nodeDis = 10 * this.scale
    
    // chaing point
    this.free = true
    this.chasingX = 0
    this.chasingY = 0
    this.shaking = false
    this.timer = 0
}

Fish.prototype.numOfFrontBody = 9
Fish.prototype.frontBodySizes = new Array(19, 20, 20, 21, 21, 22, 22, 23, 23)
Fish.prototype.numOfBackBody = 17
Fish.prototype.backBodySizes = new Array(23, 23, 22, 22, 21, 20, 19, 17, 16, 15, 14, 12, 11, 10, 9, 8, 7)

Fish.prototype.setChasingXY = function(x, y) {
    this.chasingX = x
    this.chasingY = y
}

Fish.prototype.init = function(x, y) {
    this.x = x
    this.y = y
    
    // begin to draw parts
    this.fishNodes.push(new FishHead(this.ctx, 100))
    this.fishHead = this.fishNodes[0]
    this.fishNodes[0].ctx = this.ctx
    this.fishNodes[0].x = this.x
    this.fishNodes[0].y = this.y
    
    // front body
    for(var i=0; i<this.numOfFrontBody; i++) {
        var pos = i+1
        this.fishNodes.push(new FishBody(this.ctx, this.frontBodySizes[i]))
        this.fishNodes[pos].ctx = this.ctx
        this.fishNodes[pos].x = this.fishNodes[pos-1].x - this.nodeDis
        this.fishNodes[pos].y = this.fishNodes[pos-1].y
    }
    
    this.fishNodes.push(new FishFin(this.ctx, 48))
    this.fishNodes[1+this.numOfFrontBody].ctx = this.ctx
    this.fishNodes[1+this.numOfFrontBody].x = this.fishNodes[this.numOfFrontBody].x
    this.fishNodes[1+this.numOfFrontBody].y = this.fishNodes[this.numOfFrontBody].y
    
    // back body
    for(var i=0; i<this.numOfBackBody; i++) {
        var pos = this.numOfFrontBody+2+i
        this.fishNodes.push(new FishBody(this.ctx, this.backBodySizes[i]))
        this.fishNodes[pos].ctx = this.ctx
        this.fishNodes[pos].x = this.fishNodes[pos-1].x - this.nodeDis
        this.fishNodes[pos].y = this.fishNodes[pos-1].y
    }
    
    this.fishNodes.push(new FishTail(this.ctx, 30))
    this.fishNodes[1+this.numOfFrontBody+1+this.numOfBackBody].x = this.fishNodes[1+this.numOfFrontBody+this.numOfBackBody].x
    this.fishNodes[1+this.numOfFrontBody+1+this.numOfBackBody].y = this.fishNodes[1+this.numOfFrontBody+this.numOfBackBody].y
}

Fish.prototype.draw = function() {
    for(var i in this.fishNodes) {
        this.ctx.save()
        this.ctx.translate(this.fishNodes[i].x, this.fishNodes[i].y)
        this.ctx.rotate(Math.PI * this.fishNodes[i].angle/180)
        this.ctx.scale(this.scale, this.scale)
        this.fishNodes[i].draw()
        this.ctx.restore()
    }
}

Fish.prototype.next = function() {
    for(var i=0; i<this.speed; i++) {
        this.timer = (this.timer+1) % 36;
        this.angle = this.angle + Math.sin(Math.PI*this.timer*10/180)*2
        this.x = this.x + this.nodeDis*Math.cos(Math.PI*this.angle/180)
        this.y = this.y + this.nodeDis*Math.sin(Math.PI*this.angle/180)
        
        for(var j = this.fishNodes.length - 1; j>0; j--) {
            this.fishNodes[j].x = this.fishNodes[j-1].x
            this.fishNodes[j].y = this.fishNodes[j-1].y
            this.fishNodes[j].angle = this.fishNodes[j-1].angle
        }
        
        this.fishNodes[0].angle = this.angle
        this.fishNodes[0].x = this.x
        this.fishNodes[0].y = this.y
        
        for(var j=this.numOfFrontBody; j>0; j--) {
            this.fishNodes[j].angle = this.fishNodes[0].angle
        }
    }
}

Fish.prototype.chase = function(x, y) {
    // rotate angle now angle
    var angleXY = Math.atan2(y-this.y, x-this.x)
    var angle = Math.PI * this.angle/180
    if( Math.abs(angleXY-angle) <= Math.PI*this.agility/180 || Math.abs(angleXY-angle) >= Math.PI*(360-this.agility)/180 ){
    } else if(Math.abs(angleXY - angle) <= Math.PI) {
        if(angleXY > angle) {
            this.angle = this.angle + Math.random()*this.agility
            if(this.angle > 180) 
                this.angle -= 360
        } else {
            this.angle = this.angle - Math.random()*this.agility
            if(this.angle < -180) 
                this.angle += 360
        }
    } else if(Math.abs(angleXY - angle) > Math.PI) {
        if( angleXY < angle) {
            this.angle = this.angle + Math.random()*this.agility
            if(this.angle > 180) 
                this.angle -= 360
        } else {
            this.angle = this.angle - Math.random()*this.agility
            if(this.angle < -180) 
                this.angle += 360
        }
    }
    this.next()
}

function Background(ctx) {
    this.ctx = ctx
}

Background.prototype.draw = function() {
    this.ctx.save()
    var gradient = this.ctx.createLinearGradient(0, 0, canvas.width / 2, canvas.height)
    gradient.addColorStop(0, 'rgba(176,102,254,1)')
    gradient.addColorStop(1, 'rgba(99,226,255,1)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, canvas.width, canvas.height)
    this.ctx.restore()
}

function CanvasHelper(canvas) {
    this.canvas = canvas
    this.ctx = null
    this.fish = null
    this.background = null
}
CanvasHelper.prototype.init = function() {
    if(this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d')
        this.fish = new Fish(this.ctx)
        this.background = new Background(this.ctx)
        this.fish.init(300, 300)
        
        // onmousemove chase the pointer
        window.onmousemove = function(e) {
            e.preventDefault()
            this.fish.setChasingXY(e.offsetX || e.layerX,
            e.offsetY || e.layerY)
        }.bind(this)
        
        // ontouchmove for mobile devices
        window.ontouchmove = function(e) {
            e.preventDefault()
            this.fish.setChasingXY(e.touches[0].clientX || e.touches[0].pageX || e.touches[0].screenX,
            e.touches[0].clientY || e.touches[0].pageY || e.touches[0].screenY)
        }.bind(this)
        
        this.canvas.onclick = function(e) {
            e.preventDefault()
        }
    }
}

CanvasHelper.prototype.draw = function() {
    this.fish.chase(this.fish.chasingX, this.fish.chasingY)
    if(Math.floor(Math.random()*300) == 0) {
        if(this.fish.speed == 1) this.fish.speed = 2
    }
    if(Math.floor(Math.random()*90) == 0) {
        if(this.fish.speed != 1) this.fish.speed = 1
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.background.draw()
    this.fish.draw()
}