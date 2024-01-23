import {
  Label,
  Icon,
  Input,
  Block,
  Comment,
  Glow,
  Script,
  Document,
  extensions,
  aliasExtensions,
} from "../syntax/index.js"

import SVG from "./draw.js"
import style from "./style.js"
const {
  defaultFont,
  commentFont,
  makeStyle,
  makeOriginalIcons,
  makeHighContrastIcons,
  iconName,
} = style

const unicodeIcons = {
  cloud: "☁",
  cloudOutline: "☁",
}

export class LabelView {
  constructor(label) {
    if (label.isIcon && unicodeIcons[label.name]) {
      Object.assign(this, { value: unicodeIcons[label.name] })
    } else {
      Object.assign(this, label)
    }

    this.el = null
    this.height = 12
    this.lineHeight = 5
    this.metrics = null
    this.x = 0
  }

  get isLabel() {
    return true
  }

  draw(_iconStyle) {
    return this.el
  }

  get width() {
    return this.metrics.width
  }

  measure() {
    const value = this.value
    const cls = `sb3-${this.cls}`
    let lines = value.split("\n")
    let group = []

    let y = 0
    for (let line of lines) {
      y += 12 + this.lineHeight
      group.push(
        SVG.text(0, y - this.lineHeight, line, {
          class: `sb3-label ${cls}`,
        }))
    }
    this.height = Math.max(12, y - (this.lineHeight + 1))
    
    this.el = SVG.group(group)
    
    let cache = LabelView.metricsCache[cls]
    if (!cache) {
      cache = LabelView.metricsCache[cls] = Object.create(null)
    }

    if (Object.hasOwnProperty.call(cache, value)) {
      this.metrics = cache[value]
    } else {
      const font = /comment-label/.test(this.cls) ? commentFont : defaultFont
      this.metrics = cache[value] = LabelView.measure(value, font)
      // TODO: word-spacing? (fortunately it seems to have no effect!)
    }
  }

  static measure(value, font) {
    const context = LabelView.measuring
    context.font = font
    let lines = value.split("\n")
    let width = 0
    for (let line of lines) {
      const textMetrics = context.measureText(line)
      width = Math.max(width, textMetrics.width)
    }

    width = (width + 3) | 0
    return { width: width }
  }
}

LabelView.metricsCache = {}
LabelView.toMeasure = []

export class IconView {
  constructor(icon) {
    Object.assign(this, icon)

    const info = IconView.icons[this.name]
    if (!info) {
      throw new Error(`no info for icon: ${this.name}`)
    }
    Object.assign(this, info)
    
    if (isNaN(this.scale) ||
        this.scale <= 0) {
          this.scale = 1
        }

    this.scale = !isNaN(icon.scale) && icon.scale !== null ? icon.scale : (isNaN(this.scale) || this.scale == null) ? 1 : this.scale
    this.r = !isNaN(icon.r) && icon.r !== null ? icon.r : (isNaN(this.r) || this.r == null) ? 255 : this.r
    this.g = !isNaN(icon.g) && icon.g !== null ? icon.g : (isNaN(this.g) || this.g == null) ? 255 : this.g
    this.b = !isNaN(icon.b) && icon.b !== null ? icon.b : (isNaN(this.b) || this.b == null) ? 255 : this.b
    
    if (this.scale <= 0) {
      this.scale = 1
    }

    if (isNaN(this.r) || this.r == null) {
      this.r = 255
    }

    this.width = this.width * this.scale
    this.height = this.height * this.scale

    if (!this.fillAttribute) {
      this.fillAttribute = "fill"
    }
  }

  get isIcon() {
    return true
  }

  draw(iconStyle) {
    let props = {
      width: this.width,
      height: this.height,
      transform: `scale(${this.scale})`,
    }
    if (Array.isArray(this.fillAttribute)) {
      for (const fillAttribute of this.fillAttribute) {
        props[fillAttribute] = SVG.rgbToHex(this.r, this.g, this.b)
      }
    } else {
      props[this.fillAttribute] = SVG.rgbToHex(this.r, this.g, this.b)
    }
    let symbol = SVG.setProps(SVG.symbol(`#sb3-${iconName(this.name, iconStyle)}`), props)
    console.log('symbol', symbol)
    return symbol
  }

  static get icons() {
    return {
      greenFlag: { width: 20, height: 21, dy: -2, r: 76, g: 191, b: 86 },
      stopSign: { width: 20, height: 20, r: 236, g: 89, b: 89 },
      turnLeft: { width: 24, height: 24 },
      turnRight: { width: 24, height: 24 },
      loopArrow: { width: 24, height: 24 },
      addInput: { width: 5, height: 12, r: 0, g: 0, b: 0 },
      delInput: { width: 5, height: 12, r: 0, g: 0, b: 0 },
      verticalEllipsis: { width: 2, height: 12, scale: 0.833333333, r: 0, g: 0, b: 0 },
      list: { width: 15, height: 18 },
      pointRight: { width: 12, height: 12 },
      turtle: { width: 18, height: 12 },
      turtleOutline: { width: 18, height: 12, fillAttribute: "stroke" },
      pause: { width: 20, height: 20, r: 255, g: 220, b: 0 },
      flash: { width: 10, height: 12 },
      
      arrowUp:            { width: 12, height: 12},
      arrowUpOutline:     { width: 12, height: 12, fillAttribute: "stroke"},
      arrowUpThin:        { width: 12, height: 12, fillAttribute: "stroke"},
      arrowDown:          { width: 12, height: 12},
      arrowDownOutline:   { width: 12, height: 12, fillAttribute: "stroke"},
      arrowDownThin:      { width: 12, height: 12, fillAttribute: "stroke"},
      arrowLeft:          { width: 12, height: 12},
      arrowLeftOutline:   { width: 12, height: 12, fillAttribute: "stroke"},
      arrowLeftThin:      { width: 12, height: 12, fillAttribute: "stroke"},
      arrowRight:         { width: 12, height: 12},
      arrowRightOutline:  { width: 12, height: 12, fillAttribute: "stroke"},
      arrowRightThin:     { width: 12, height: 12, fillAttribute: "stroke"},
      arrowUpDownThin:    { width: 12, height: 12, fillAttribute: "stroke"},
      arrowLeftRightThin: { width: 12, height: 12, fillAttribute: "stroke"},

      musicBlock: { width: 40, height: 40 },
      penBlock: { width: 40, height: 40 },
      videoBlock: { width: 40, height: 40, dy: 10 },
      ttsBlock: { width: 40, height: 40 },
      translateBlock: { width: 40, height: 40 },
      wedoBlock: { width: 40, height: 40 },
      ev3Block: { width: 40, height: 40 },
      microbitBlock: { width: 40, height: 40 },
      makeymakeyBlock: { width: 40, height: 40 },
      gdxforBlock: { width: 40, height: 40 },
      boostBlock: { width: 40, height: 40 },
    }
  }
}

export class LineView {
  constructor() {
    this.width = 1
    this.height = 40
    this.x = 0
  }

  get isLine() {
    return true
  }

  measure() {}

  draw(_iconStyle, parent) {
    const category = parent.info.category
    return SVG.el("line", {
      class: `sb3-${category}-line`,
      "stroke-linecap": "round",
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 40,
    })
  }
}

export class InputView {
  constructor(input) {
    Object.assign(this, input)
    if (input.label) {
      this.label = newView(input.label)
    }
    this.isBoolean = this.shape === "boolean"
    this.isDropdown = this.shape === "dropdown"
    this.isRound = !(this.isBoolean || this.isDropdown)

    this.x = 0
  }

  get isInput() {
    return true
  }

  measure() {
    if (this.hasLabel) {
      this.label.measure()
    }
  }

  static get shapes() {
    return {
      string: SVG.pillRect,
      number: SVG.pillRect,
      "number-dropdown": SVG.pillRect,
      color: SVG.pillRect,
      dropdown: SVG.roundRect,

      boolean: SVG.pointedRect,
      stack: SVG.stackRect,
      reporter: SVG.pillRect,
    }
  }

  draw(iconStyle, parent) {
    let w
    let label
    if (this.isBoolean) {
      w = 48
    } else if (this.isColor) {
      w = 40
    } else if (this.hasLabel) {
      label = this.label.draw(iconStyle)
      // Minimum padding of 11
      // Minimum width of 40, at which point we center the label
      const px = this.label.width >= 18 ? 11 : (40 - this.label.width) / 2
      w = this.label.width + 2 * px
      label = SVG.move(px, 9, label)
    } else {
      w = this.isInset ? 30 : null
    }
    if (this.hasArrow) {
      w += 20
    }
    this.width = w

    let h = this.hasLabel ? this.label.height + 19 : 32

    if (this.isRound || this.isColor) {
      h += 1
    }

    this.height = h

    const el = InputView.shapes[this.shape](w, h)
    SVG.setProps(el, {
      class: `${
        this.isColor ? "" : `sb3-${parent.info.category}`
      } sb3-input sb3-input-${this.shape}`,
    })

    if (this.isColor) {
      SVG.setProps(el, {
        fill: this.value,
      })
    } else if (this.shape === "dropdown") {
      // custom colors
      if (parent.info.color) {
        SVG.setProps(el, {
          fill: parent.info.color,
          stroke: "rgba(0, 0, 0, 0.2)",
        })
      }
    } else if (this.shape === "number-dropdown") {
      el.classList.add(`sb3-${parent.info.category}-alt`)

      // custom colors
      if (parent.info.color) {
        SVG.setProps(el, {
          fill: "rgba(0, 0, 0, 0.1)",
          stroke: "rgba(0, 0, 0, 0.15)", // combines with fill...
        })
      }
    } else if (this.shape === "boolean") {
      el.classList.remove(`sb3-${parent.info.category}`)
      el.classList.add(`sb3-${parent.info.category}-dark`)

      // custom colors
      if (parent.info.color) {
        SVG.setProps(el, {
          fill: "rgba(0, 0, 0, 0.15)",
        })
      }
    }

    const result = SVG.group([el])
    if (this.hasLabel) {
      result.appendChild(label)
    }
    if (this.hasArrow) {
      result.appendChild(
        SVG.move(
          w - 24,
          13,
          SVG.symbol(
            iconStyle === "high-contrast"
              ? "#sb3-dropdownArrow-high-contrast"
              : "#sb3-dropdownArrow",
            {},
          ),
        ),
      )
    }
    return result
  }
}

class BlockView {
  constructor(block) {
    Object.assign(this, block)
    this.children = block.children.map(newView)
    this.comment = this.comment ? newView(this.comment) : null
    this.isRound = this.isReporter

    // Avoid accidental mutation
    this.info = { ...block.info }
    if (
      Object.prototype.hasOwnProperty.call(aliasExtensions, this.info.category)
    ) {
      this.info.category = aliasExtensions[this.info.category]
    }
    if (Object.prototype.hasOwnProperty.call(extensions, this.info.category)) {
      this.children.unshift(new LineView())
      this.children.unshift(
        new IconView({ name: this.info.category + "Block" }),
      )
      this.info.category = "extension"
    }

    this.x = 0
    this.width = null
    this.height = null
    this.firstLine = null
    this.innerWidth = null
  }

  get isBlock() {
    return true
  }

  measure() {
    for (const child of this.children) {
      if (child.measure) {
        child.measure()
      }
    }
    if (this.comment) {
      this.comment.measure()
    }
  }

  static get shapes() {
    return {
      stack: SVG.stackRect,
      "c-block": SVG.stackRect,
      "if-block": SVG.stackRect,
      celse: SVG.stackRect,
      cend: SVG.stackRect,

      cap: SVG.capRect,
      reporter: SVG.pillRect,
      boolean: SVG.pointedRect,
      hat: SVG.hatRect,
      cat: SVG.catHat,
      "define-hat": SVG.procHatRect,
      "snap-define": SVG.hatRect,
      ring: SVG.pillRect,
    }
  }

  drawSelf(iconStyle, w, h, lines) {
    // mouths
    if (lines.length > 1) {
      let y = lines[0].height
      const p = []
      console.log('shape', this.info.shape)
      if (this.info.shape === 'stack') {
        p.push(SVG.getTop(w))
      } else if (this.info.shape === "reporter") {
        p.push(SVG.getRoundedTop(w, h, Math.max(lines[0].height, lines[lines.length - 1].height) / 2))
      } else if (this.info.shape === "boolean") {
        p.push(SVG.getPointedTop(w, h))
      } else {
        p.push(SVG.getTop(w))
      }
      let addBottom = true
      let hasNotch = true
      let inset = 0
      let isLast = false
      let showBooleanRight = true
      for (let i = 1; i < lines.length; i += 1) {
        isLast = i + 2 === lines.length

        if (lines[i] instanceof ScriptView) {
          p.push(SVG.getRightAndBottom(w - (this.info.shape === "boolean") * 20, y,  true, 15))
          y += lines[i].height - 3
          p.push(SVG.getArm(w - (this.info.shape === "boolean") * 20, y))
          
          hasNotch = !(isLast && this.isFinal)
          inset = isLast ? 0 : 15
          y += lines[i + 1].height + 3
          addBottom = false
          showBooleanRight = false
          i++
        } else {
          y += lines[i].height
          addBottom = true
        }
      }
      if (this.info.shape === "stack") {
        p.push(SVG.getRightAndBottom(w, y, !this.isFinal, 0))
      } else if (this.info.shape === "reporter") {
        console.log('sb3 lines', lines)
        p.push(SVG.getRoundedBottom(w, y, Math.max(lines[0].height, lines[lines.length - 1].height) / 2))
      } else if (this.info.shape === "boolean") {
        p.push(SVG.getPointedBottom(w, h, showBooleanRight))
      } else {
        p.push(SVG.getRightAndBottom(w, y, !this.isFinal, 0))
      }
      return SVG.path({
        class: `sb3-${this.info.category}`,
        path: p
      })
    }

    // outlines
    if (/outline-\w+/.test(this.info.shape)) {
      if (this.info.shape === "outline-stack") {
        return SVG.setProps(SVG.stackRect(w, h), {
          class: `sb3-${this.info.category} sb3-${this.info.category}-alt`,
        })
      } else if (this.info.shape === "outline-reporter") {
        return SVG.setProps(SVG.pillRect(w, h), {
          class: `sb3-${this.info.category} sb3-${this.info.category}-alt`,
        })
      } else if (this.info.shape === "outline-boolean") {
        return SVG.setProps(SVG.pointedRect(w, h), {
          class: `sb3-${this.info.category} sb3-${this.info.category}-alt`,
        })
      }
    }

    // rings
    if (this.isRing) {
      const child = this.children[0]
      if (child && (child.isInput || child.isBlock || child.isScript)) {
        return SVG.roundRect(w, h, {
          class: `sb3-${this.info.category}`,
        })
      }
    }

    const func = BlockView.shapes[this.info.shape]
    if (!func) {
      throw new Error(`no shape func: ${this.info.shape}`)
    }
    return func(w, h, {
      class: `sb3-${this.info.category}`,
    })
  }

  static get padding() {
    return {
      hat: [24, 8],
      cat: [24, 8],
      "define-hat": [20, 16],
      "snap-define": [24, 12],
      null: [4, 4],
    }
  }

  horizontalPadding(child) {
    if (this.isRound) {
      if (child.isIcon) {
        return 16
      } else if (child.isLabel) {
        return 12 // text in circle: 3 units
      } else if (child.isDropdown) {
        return 12 // square in circle: 3 units
      } else if (child.isBoolean) {
        return 12 // hexagon in circle: 3 units
      } else if (child.isRound) {
        return 4 // circle in circle: 1 unit
      }
    } else if (this.isBoolean) {
      if (child.isIcon) {
        return 24 // icon in hexagon: ???
      } else if (child.isLabel) {
        return 20 // text in hexagon: 5 units
      } else if (child.isDropdown) {
        return 20 // square in hexagon: 5 units
      } else if (child.isRound && child.isBlock) {
        return 24 // circle in hexagon: 5 + 1 units
      } else if (child.isRound) {
        return 20 // circle in hexagon: 5 units
      } else if (child.isBoolean) {
        return 8 // hexagon in hexagon: 2 units
      }
    }
    return 8 // default: 2 units
  }

  marginBetween(a, b) {
    // Consecutive labels should be rendered as a single text element.
    // For now, approximate the size of one space
    if (a.isLabel && b.isLabel) {
      return 5
    }

    return 8 // default: 2 units
  }

  draw(iconStyle) {
    const isDefine = this.info.shape === "define-hat"
    let children = this.children
    const isCommand = this.isCommand

    const padding = BlockView.padding[this.info.shape] || BlockView.padding.null
    const pt = padding[0],
      pb = padding[1]

    let y = this.info.shape === "cat" ? 16 : 0
    const Line = function (y) {
      this.y = y
      this.width = 0
      this.height = isCommand ? 21 : 21
      this.children = []
    }

    let innerWidth = 0
    let scriptWidth = 0
    let line = new Line(y)
    const pushLine = (type) => {
      if (([0, null]).includes(type)) {
        line.height += pt + pb
      } else {
        // line.height -= 11
        line.y -= 2
      }
      y += line.height
      lines.push(line)
    }

    if (this.info.isRTL) {
      let start = 0
      const flip = () => {
        children = children
          .slice(0, start)
          .concat(children.slice(start, i).reverse())
          .concat(children.slice(i))
      }
      let i
      for (i = 0; i < children.length; i++) {
        if (children[i].isScript) {
          flip()
          start = i + 1
        }
      }
      if (start < i) {
        flip()
      }
    }

    const lines = []
    let previousChild
    let lastChild
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.el = child.draw(iconStyle, this)

      if (child.isScript) {
        this.hasScript = true
        if (lines.length === 0) {
          if (line.height <= 21) {
            console.log('sb3 greater', line)
            if (isCommand) {
              line.height += 7
            }
            line.height += pt + pb
            // line.y += isCommand ? 6 : 3
          }
        }
        pushLine(0)
        child.y = y - 1
        lines.push(child)
        scriptWidth = Math.max(scriptWidth, Math.max(1, child.width))
        child.height = Math.max(29, child.height + 3) - 2
        y += child.height + 4
        line = new Line(y)
        previousChild = null
      } else if (child.isLoop) {
        line.children.push(child)
        previousChild = child
      } else if (child.isLabel &&
        child.value === "\n") {
        // child.y = y
        console.log('line', line.height)
        console.log('sb3 previous', previousChild)
        if (lines.length === 0) {
          if (line.height <= 21) {
            console.log('sb3 greater', line)
            if (isCommand) {
              line.height += 7
            }
            line.height += pt + pb
            line.y += isCommand ? 7 : 3
          }
        }
        pushLine(1)
        line = new Line(y)
      } else {
        // Remember the last child on the first line
        if (!lines.length) {
          lastChild = child
        }

        // Leave space between inputs
        if (previousChild && line.children.length > 0) {
          line.width += this.marginBetween(previousChild, child)
        }

        // Align first input with right of notch
        if (children[0] != null) {
          const cmw = 48 - this.horizontalPadding(children[0])
          if (
            (this.isCommand || this.isOutline) &&
            !child.isLabel &&
            !child.isIcon &&
            line.width < cmw
          ) {
            line.width = cmw
          }
        }

        // Align extension category icons below notch
        if (child.isIcon && i === 0 && this.isCommand) {
          line.height = Math.max(line.height, child.height + 8)
        }

        child.x = line.width
        line.width += child.width
        innerWidth = Math.max(innerWidth, line.width)
        if (!child.isLabel) {
          line.height = Math.max(line.height, child.height)
        }
        line.children.push(child)
        previousChild = child
      }
    }
    if (lines.length === 0) {
      console.log('0 before height', line.height)
      line.height = Math.max(line.height, isCommand ? 40 : 32)
      console.log('0 after height', line.height)
      pushLine(0)
    } else {
      line.height += pt + pb
      console.log('pt + pb', pt + pb)
      line.y -= pt
      pushLine(1)
    }

    let padLeft = children.length ? this.horizontalPadding(children[0]) : 0
    const padRight = children.length ? this.horizontalPadding(lastChild) : 0
    innerWidth += padLeft + padRight

    // Commands have a minimum width
    // The hat min-width is arbitrary (not sure of Scratch 3 value)
    // Outline min-width is deliberately higher (because Scratch 3 looks silly)
    const originalInnerWidth = innerWidth
    innerWidth = Math.max(
      this.hasScript
        ? 160
        : this.isHat
        ? 108
        : this.isCommand || this.isOutline
        ? 64
        : this.isReporter
        ? 48
        : 0,
      innerWidth,
    )

    // Center the label text inside small reporters.
    if (this.isReporter) {
      padLeft += (innerWidth - originalInnerWidth) / 2
    }

    this.height = y

    this.width = scriptWidth
      ? Math.max(innerWidth, 15 + scriptWidth)
      : innerWidth
    this.firstLine = lines[0]
    this.innerWidth = innerWidth

    const objects = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.isScript) {
        objects.push(SVG.move(16, line.y, line.el))
        continue
      }

      const h = line.height

      for (let j = 0; j < line.children.length; j++) {
        const child = line.children[j]
        if (child.isLoop) {
          objects.push(SVG.move(innerWidth - 32, this.height - 28, child.el))
          continue
        }

        let y = pt + (h - child.height - pt - pb) / 2
        if (child.isLabel && i === 0) {
          // We only do this for the first line so that the `else` label is
          // correctly aligned
          y -= 1
        } else if (isDefine && child.isLabel) {
          y += 3
        } else if (child.isIcon) {
          y += child.dy | 0
          if (this.isCommand && i === 0 && j === 0) {
            y += 4
          }
        }

        let x = padLeft + child.x
        if (child.dx) {
          x += child.dx
        }

        objects.push(SVG.move(x, (line.y + y) | 0, child.el))
      }
    }

    const el = this.drawSelf(iconStyle, innerWidth, this.height, lines)
    objects.splice(0, 0, el)
    if (this.info.color) {
      SVG.setProps(el, {
        fill: this.info.color,
        stroke: "rgba(0, 0, 0, 0.2)",
      })
    }

    return SVG.group(objects)
  }
}

export class CommentView {
  constructor(comment) {
    Object.assign(this, comment)
    this.label = newView(comment.label)

    this.width = null
  }

  get isComment() {
    return true
  }

  static get lineLength() {
    return 12
  }

  get height() {
    return 20
  }

  measure() {
    this.label.measure()
  }

  draw(iconStyle) {
    const labelEl = this.label.draw(iconStyle)

    this.width = this.label.width + 16
    return SVG.group([
      SVG.commentLine(this.hasBlock ? CommentView.lineLength : 0, 6),
      SVG.commentRect(this.width, this.height, {
        class: "sb3-comment",
      }),
      SVG.move(8, 4, labelEl),
    ])
  }
}

class GlowView {
  constructor(glow) {
    Object.assign(this, glow)
    this.child = newView(glow.child)

    this.width = null
    this.height = null
    this.y = 0
  }

  get isGlow() {
    return true
  }

  measure() {
    this.child.measure()
  }

  drawSelf() {
    const c = this.child
    let el
    const w = this.width
    const h = this.height - 1
    if (c.isScript) {
      if (!c.isEmpty && c.blocks[0].isHat) {
        el = SVG.hatRect(w, h)
      } else if (c.isFinal) {
        el = SVG.capRect(w, h)
      } else {
        el = SVG.stackRect(w, h)
      }
    } else {
      el = c.drawSelf(w, h, [])
    }
    return SVG.setProps(el, {
      class: "sb3-diff sb3-diff-ins",
    })
  }
  // TODO how can we always raise Glows above their parents?

  draw(iconStyle) {
    const c = this.child
    const el = c.isScript ? c.draw(iconStyle, true) : c.draw(iconStyle)

    this.width = c.width
    this.height = (c.isBlock && c.firstLine.height) || c.height

    // encircle
    return SVG.group([el, this.drawSelf()])
  }
}

class ScriptView {
  constructor(script) {
    Object.assign(this, script)
    this.blocks = script.blocks.map(newView)

    this.y = 0
  }

  get isScript() {
    return true
  }

  measure() {
    for (const block of this.blocks) {
      block.measure()
    }
  }

  draw(iconStyle, inside) {
    const children = []
    let y = 1
    this.width = 0
    for (const block of this.blocks) {
      const x = inside ? 0 : 2
      const child = block.draw(iconStyle)
      children.push(SVG.move(x, y, child))
      this.width = Math.max(this.width, block.width)

      const diff = block.diff
      if (diff === "-") {
        const dw = block.width
        const dh = block.firstLine.height || block.height
        children.push(SVG.move(x, y + dh / 2 + 1, SVG.strikethroughLine(dw)))
        this.width = Math.max(this.width, block.width)
      }

      y += block.height

      const comment = block.comment
      if (comment) {
        const line = block.firstLine
        const cx = block.innerWidth + 2 + CommentView.lineLength
        const cy = y - block.height + line.height / 2
        const el = comment.draw(iconStyle)
        children.push(SVG.move(cx, cy - comment.height / 2, el))
        this.width = Math.max(this.width, cx + comment.width)
      }
    }
    const lastBlock = this.blocks[this.blocks.length - 1]
    this.height = y + 1
    if (!inside && !this.isFinal) {
      this.height += lastBlock.hasPuzzle ? 8 : 0
    }
    if (!inside && lastBlock.isGlow) {
      this.height += 7 // TODO unbreak this
    }
    return SVG.group(children)
  }
}

class DocumentView {
  constructor(doc, options) {
    Object.assign(this, doc)
    this.scripts = doc.scripts.map(newView)

    this.width = null
    this.height = null
    this.el = null
    this.defs = null
    this.scale = options.scale
    this.iconStyle = options.style.replace("scratch3-", "")
  }

  measure() {
    this.scripts.forEach(script => {
      script.measure()
    })
  }

  render(cb) {
    if (typeof cb === "function") {
      throw new Error("render() no longer takes a callback")
    }

    // measure strings
    this.measure()

    // TODO: separate layout + render steps.
    // render each script
    let width = 0
    let height = 0
    const elements = []
    for (let i = 0; i < this.scripts.length; i++) {
      const script = this.scripts[i]
      if (height) {
        height += 10
      }
      script.y = height
      elements.push(SVG.move(0, height, script.draw(this.iconStyle)))
      height += script.height
      if (i !== this.scripts.length - 1) {
        height += 36
      }
      width = Math.max(width, script.width + 4)
    }
    this.width = width
    this.height = height

    // return SVG
    const svg = SVG.newSVG(width, height, this.scale)
    const icons =
      this.iconStyle === "high-contrast"
        ? makeHighContrastIcons()
        : makeOriginalIcons()
    svg.appendChild((this.defs = SVG.withChildren(SVG.el("defs"), icons)))

    svg.appendChild(
      SVG.setProps(SVG.group(elements), {
        style: `transform: scale(${this.scale})`,
      }),
    )
    this.el = svg
    return svg
  }

  /* Export SVG image as XML string */
  exportSVGString() {
    if (this.el == null) {
      throw new Error("call draw() first")
    }

    const style = makeStyle()
    this.defs.appendChild(style)
    const xml = new SVG.XMLSerializer().serializeToString(this.el)
    this.defs.removeChild(style)
    return xml
  }

  /* Export SVG image as data URI */
  exportSVG() {
    const xml = this.exportSVGString()
    return `data:image/svg+xml;utf8,${xml.replace(/[#]/g, encodeURIComponent)}`
  }

  toCanvas(cb, exportScale) {
    exportScale = exportScale || 1.0

    const canvas = SVG.makeCanvas()
    canvas.width = Math.max(1, this.width * exportScale * this.scale)
    canvas.height = Math.max(1, this.height * exportScale * this.scale)
    const context = canvas.getContext("2d")

    const image = new Image()
    image.src = this.exportSVG()
    image.onload = () => {
      context.save()
      context.scale(exportScale, exportScale)
      context.drawImage(image, 0, 0)
      context.restore()

      cb(canvas)
    }
  }

  exportPNG(cb, scale) {
    this.toCanvas(canvas => {
      if (URL && URL.createObjectURL && Blob && canvas.toBlob) {
        canvas.toBlob(blob => {
          cb(URL.createObjectURL(blob))
        }, "image/png")
      } else {
        cb(canvas.toDataURL("image/png"))
      }
    }, scale)
  }
}

const viewFor = node => {
  if (node instanceof Icon && unicodeIcons[node.name]) {
    return LabelView
  }

  switch (node.constructor) {
    case Label:
      return LabelView
    case Icon:
      return IconView
    case Input:
      return InputView
    case Block:
      return BlockView
    case Comment:
      return CommentView
    case Glow:
      return GlowView
    case Script:
      return ScriptView
    case Document:
      return DocumentView
    default:
      throw new Error(`no view for ${node.constructor.name}`)
  }
}

export const newView = (node, options) => new (viewFor(node))(node, options)
