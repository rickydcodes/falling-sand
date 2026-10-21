let squareWidth = 5

let canvas = document.querySelector("canvas")
let size25Button = document.querySelector("#size25Button")
let size50Button = document.querySelector("#size50Button")
let size75Button = document.querySelector("#size75Button")
let size100Button = document.querySelector("#size100Button")
let sizeParagraph = document.querySelector("#sizeParagraph")
let context = canvas.getContext("2d")

let grid = createGrid()
let mouseDown = false
let hue = 0
let spread = 2
let interval

document.addEventListener("DOMContentLoaded", renderCanvas)
canvas.addEventListener("mousemove", draw)
canvas.addEventListener("mousedown", mousedown)
canvas.addEventListener("mouseup", mouseup)
canvas.addEventListener("mouseleave", mouseup)

size25Button.addEventListener("click", changeSize25)
size50Button.addEventListener("click", changeSize50)
size75Button.addEventListener("click", changeSize75)
size100Button.addEventListener("click", changeSize100)

setInterval(renderCanvas, 15)

function mousedown(event) {
  mouseDown = true
  clearInterval(interval)
  interval = setInterval(draw.bind(this, event), 70)
}

function mouseup() {
  mouseDown = false
  clearInterval(interval)
}

function createGrid() {
  let newGrid = []

  for (let y = 0; y < canvas.height / squareWidth; y++) {
    let row = []

    for (let x = 0; x < canvas.width / squareWidth; x++) {
      row.push(0)
    }

    newGrid.push(row)
  }

  return newGrid
}

function draw(event) {
  if (mouseDown) {
    let mouseX = event.offsetX
    let mouseY = event.offsetY

    if (mouseX >= 0 && mouseX < canvas.width && mouseY >= 0 && mouseY < canvas.height) {
      let row = Math.floor(mouseY / squareWidth)
      let col = Math.floor(mouseX / squareWidth)

      grid[row][col] = 0

      for (let y = -Math.floor(spread / 2); y < Math.floor(spread / 2); y++) {
        for (let x = -Math.floor(spread / 2); x < Math.floor(spread / 2); x++) {
          let show = Math.floor(Math.random() * 3)
          row = Math.floor(mouseY / squareWidth) + y
          col = Math.floor(mouseX / squareWidth) + x

          if (show > 0 && row >= 0 && row < canvas.width && col >= 0 && col < canvas.height) {
            grid[row][col] = 1
          }
        }
      }
    }

    clearInterval(interval)
    interval = setInterval(draw.bind(this, event), 200)
  }
}

function renderCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == 0) {
        context.fillStyle = "black"
      } else {
        context.fillStyle = `HSL(${360 * (y / (canvas.height / squareWidth))}, 100%, 50%)`
      }

      context.fillRect(squareWidth * x, squareWidth * y, squareWidth, squareWidth)
    }
  }

  let newGrid = createGrid()

  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] > 0 && y + 1 < grid.length) {
        if (grid[y + 1][x] == 0) {
          newGrid[y + 1][x] = grid[y][x]
        } else if (grid[y + 1][x + 1] == 0) {
          newGrid[y + 1][x + 1] = grid[y][x]
        } else if (grid[y + 1][x - 1] == 0) {
          newGrid[y + 1][x - 1] = grid[y][x]
        } else {
          newGrid[y][x] = grid[y][x]
        }
      } else {
        newGrid[y][x] = grid[y][x]
      }
    }
  }

  grid = newGrid
}

function changeSize25() {
  spread = 1
  sizeParagraph.innerHTML = "Selected size: 25%"
}

function changeSize50() {
  spread = 3
  sizeParagraph.innerHTML = "Selected size: 50%"
}

function changeSize75() {
  spread = 4
  sizeParagraph.innerHTML = "Selected size: 75%"
}

function changeSize100() {
  spread = 6
  sizeParagraph.innerHTML = "Selected size: 100%"
}
