import * as PIXI from 'pixi.js';
import * as buildings from 'v3/data/loaders/buildings';
import * as items from 'v3/data/loaders/items';

const WIDTH = 220
const HEIGHT = 145
const TOPHEIGHT = HEIGHT - 35
const GREY = 0x313234
const GREEN = 0x15CB07
const YELLOW = 0xD4CE22
const ORANGE = 0xFFA328
const DARKGREY = 0x232422
const PURPLE = 0x7122D5

const NAMESTYLE = new PIXI.TextStyle ({
  align: 'left',
  fill: '#ffffff',
  fontSize: 22,
  fontFamily: '"Bebas Neue", sans-serif',
  breakWords: true,
  wordWrapWidth: WIDTH - 30,
  wordWrap: true
})

const LEVELSTYLE = new PIXI.TextStyle({
  align: 'left',
  fill: '#ffffff',
  fontSize: 28,
  fontFamily: '"Roboto Condensed", sans-serif'
})

const EFFICIENCYSTYLE = new PIXI.TextStyle({
  align: 'left',
  fill: '#15CB07',
  fontSize: 28,
  fontFamily: '"Roboto Condensed", sans-serif'
})

const INPUTSTYLE = new PIXI.TextStyle({
  align: 'left',
  fill: '#15CB07',
  fontSize: 20,
  fontFamily: '"Roboto Condensed", sans-serif'
})

const OUTPUTSTYLE = new PIXI.TextStyle({
  align: 'left',
  fill: '#FFA328',
  fontSize: 20,
  fontFamily: '"Roboto Condensed", Helvetica, sans-serif'
})


const drawInPoint = (g:PIXI.Graphics, x:number, inOffset:number) => {
  g.beginFill(GREEN, 1)
  g.lineStyle(4, GREY, 1)
  g.drawCircle(x, inOffset, 8)
  g.endFill()
}

const drawOutPoint = (g:PIXI.Graphics, x:number, outOffset:number) => {
  g.beginFill(ORANGE, 1)
  g.lineStyle(4, GREY, 1)
  g.drawCircle(x+WIDTH, outOffset, 8)
  g.endFill()
}

export const Node = (x:number, y:number, name:string, input:string, output:string, level:string, efficiency:number, machine:string, nIn:number, nOut:number) =>
  {
    const container = new PIXI.Container()
    const gfx = new PIXI.Graphics()
  
    gfx.lineStyle(4, YELLOW, 1)
    gfx.beginFill(GREY, 1.0)
    gfx.drawRoundedRect(x, y, WIDTH, HEIGHT, 10)
    gfx.endFill()
    gfx.lineStyle(3, YELLOW, 1)
    gfx.moveTo(x, y + 110)
    gfx.lineTo(x + WIDTH, y + 110)

    const baseName = items.getItemDefinition(name).name
    const baseMetrics = PIXI.TextMetrics.measureText(baseName, NAMESTYLE)
    let adjName = ''

    if (baseMetrics.lineWidths[0] < WIDTH - 40) {
      adjName = baseMetrics.lines[0]
      if (baseMetrics.lineWidths.length > 1) {
        adjName += '...'
      }
    } else {
      const newMet = PIXI.TextMetrics.measureText(baseMetrics.lines[0] + '...', NAMESTYLE)
      adjName = newMet.lines[0] + '...'
    }

    const namestr = new PIXI.Text(adjName, NAMESTYLE)
    namestr.position.x = x + 33
    namestr.position.y = y + 119

    const levelstr = new PIXI.Text(level, LEVELSTYLE)
    levelstr.position.x = x + 120
    levelstr.position.y = y + 25

    const efficiencystr = new PIXI.Text(efficiency.toString() + '%', EFFICIENCYSTYLE)
    efficiencystr.position.x = x + 120
    efficiencystr.position.y = y + 55

    const inputstr = new PIXI.Text(input, INPUTSTYLE)
    inputstr.position.x = x + 7
    inputstr.position.y = y + HEIGHT + 5

    const outputstr = new PIXI.Text(output, OUTPUTSTYLE)
    outputstr.position.x = x + 7
    outputstr.position.y = y + HEIGHT + 25

    const inOffsets = [];
    for(let i = 0; i < nIn; i++) {
      inOffsets[i] = Math.floor(y + (i + 1) * (TOPHEIGHT) / (nIn + 1))
    }
  
    const outOffsets = [];
    for(let i = 0; i < nOut; i++) {
      outOffsets[i] = Math.floor(y + (i + 1) * (TOPHEIGHT) / (nOut + 1))
    }

    inOffsets.forEach(function(offset){
      drawInPoint(gfx, x, offset)
    })

    outOffsets.forEach(function(offset){
      drawOutPoint(gfx, x, offset)
    })

    const machineimg = buildings.getBuildingIcon(machine, 256)
    const machineicon = new PIXI.BaseTexture(machineimg)
    const machinetex = new PIXI.Texture(machineicon)
    const machinesprite = new PIXI.Sprite(machinetex)

    machinesprite.position.x = x + 15
    machinesprite.position.y = y + 5
    machinesprite.width = 95
    machinesprite.height = 95

    const itemimg = items.getItemIcon(name, 64)
    const itemicon = new PIXI.BaseTexture(itemimg)
    const itemtex = new PIXI.Texture(itemicon)
    const itemsprite = new PIXI.Sprite(itemtex)

    itemsprite.position.x = x + 7
    itemsprite.position.y = y + TOPHEIGHT + 8
    itemsprite.width = 20
    itemsprite.height = 20

    container.addChild(gfx)
    container.addChild(namestr)
    container.addChild(levelstr)
    container.addChild(efficiencystr)
    container.addChild(inputstr)
    container.addChild(outputstr)
    container.addChild(machinesprite)
    container.addChild(itemsprite)
    // container.cacheAsBitmap = true
    return container
  }


