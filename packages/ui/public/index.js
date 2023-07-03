function createAudioElement(file) {
  const audio = document.createElement('audio')
  audio.src = `http://127.0.0.1:3000/${file}`
  audio.autoplay = true
  return audio
}

let el
switchStoryElement = (parent) => {
  el = document.createElement('p')
  parent.appendChild(el)
}
appendStoryElement = (text) => {
  el.innerHTML += text
}

let isScrolling = false
window.addEventListener('scroll', () => {
  isScrolling = true
  setTimeout(() => {
    isScrolling = false
  }, 3000)
})

shouldFollowStory = (threshold = 100) => {
  const el = document.scrollingElement
  const scrollSize = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop)
  const isAtBottom = scrollSize < threshold
  return !isScrolling && isAtBottom
}

async function read() {
  document.getElementById('controls').style.display = 'none'
  const output = document.getElementById('output')
  const audio = document.getElementById('audio')
  const response = await fetch(`http://127.0.0.1:3000`)
  if (response.body) {
    const reader = response.body.getReader()
    let i = 0
    let hist = []
    let isSnapshot = true
    switchStoryElement(output)

    while (true) {
      const { done, value: chunk } = await reader.read()
      const chars = new TextDecoder().decode(chunk).slice(0, -1)
      for (const char of chars.split('\n')) {
        hist = `${hist}${char}`.slice(-8)
        if (char.startsWith('play:')) {
          if (!isSnapshot) {
            audio.appendChild(createAudioElement(char.slice(5)))
          }
        } else {
          if (hist.endsWith('<br><br>')) {
            switchStoryElement(output)
          } else {
            appendStoryElement(char)
          }
        }
        if (shouldFollowStory()) {
          document.getElementById('end').scrollIntoView()
        }
        i = (i + 1) % 1024
      }
      if (done) break
      if (isSnapshot) {
        setTimeout(() => {
          isSnapshot = false
          document.getElementById('end').scrollIntoView()
        }, 100)
      }
    }
  }
}

document.getElementById('play').addEventListener('click', () => read())
