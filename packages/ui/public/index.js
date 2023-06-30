function createAudioElement(file) {
  const audio = document.createElement('audio')
  audio.src = `http://127.0.0.1:3000/${file}`
  audio.autoplay = true
  return audio
}

async function read() {
  document.getElementById('controls').style.display = 'none'
  const output = document.getElementById('output')
  const audio = document.getElementById('audio')
  const response = await fetch(`http://127.0.0.1:3000`)
  if (response.body) {
    const reader = response.body.getReader()
    const audios = []
    while (true) {
      const { done, value: chunk } = await reader.read()
      const char = new TextDecoder().decode(chunk).slice(0, -1)
      if (char.startsWith('play:')) {
        audio.appendChild(createAudioElement(char.slice(5)))
      } else {
        output.innerHTML += char
      }
      if (done) break
    }
  }
}

document.getElementById('play').addEventListener('click', () => read())
