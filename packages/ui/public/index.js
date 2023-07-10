function createAudioElement(file, volume) {
  const audioEl = document.createElement('audio')
  audioEl.src = `http://127.0.0.1:3000/${file}`
  audioEl.volume = volume
  audioEl.crossOrigin = 'anonymous'
  return audioEl
}

function createTrack(audioContext, audioEl, gainValue) {
  const track = audioContext.createMediaElementSource(audioEl)

  const gain = audioContext.createGain()
  gain.gain.value = gainValue

  track.connect(gain)

  return { in: track, gain, out: gain }
}

function createDelay(audioContext, delayValue, gainValue) {
  // Now, create a gain node (to control the volume of the echo)
  const gain = audioContext.createGain()

  // And a delay node
  const delay = audioContext.createDelay(60)

  // The amount of time in seconds for the initial echo delay
  delay.delayTime.value = delayValue

  // The amount of volume reduction for each echo. This is in the range [0.0, 1.0]
  gain.gain.value = gainValue

  delay.connect(gain)

  // Connect the gain back to the delay to create a feedback loop
  gain.connect(delay)

  return { in: delay, gain, out: gain }
}

function createCompressor(audioContext) {
  // Add compressor to keep constant volume
  const compressor = audioContext.createDynamicsCompressor()
  compressor.threshold.value = -50
  compressor.knee.value = 20
  compressor.ratio.value = 15
  compressor.attack.value = 0
  compressor.release.value = 1

  return { in: compressor, out: compressor }
}

function crossfade(audioContext, oldTrack, newTrack, durationSeconds) {
  newTrack.gain.gain.setValueAtTime(0, audioContext.currentTime)

  // When the crossfade starts, reduce the volume of source 1 to 0 and increase the volume of source 2 to 1
  oldTrack.gain.gain.linearRampToValueAtTime(
    0,
    audioContext.currentTime + durationSeconds
  )
  newTrack.gain.gain.linearRampToValueAtTime(
    1,
    audioContext.currentTime + durationSeconds
  )
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
  const response = await fetch(`http://127.0.0.1:3000`)
  if (response.body) {
    const reader = response.body.getReader()
    let i = 0
    let hist = []
    let isSnapshot = true
    switchStoryElement(output)
    const audioContext = new AudioContext()

    while (true) {
      const { done, value: chunk } = await reader.read()
      const chars = new TextDecoder().decode(chunk).slice(0, -1)
      for (const char of chars.split('\n')) {
        hist = `${hist}${char}`.slice(-8)
        let oldTrack
        if (char.startsWith('play:')) {
          if (!isSnapshot) {
            const audioSrc = char.slice(5)
            const isVoice = audioSrc.startsWith('audio/voice')
            const audioEl = createAudioElement(audioSrc, isVoice ? 1 : 0.38)
            const track = createTrack(audioContext, audioEl, 1)

            if (oldTrack) {
              crossfade(audioContext, oldTrack, track, 2)
            }

            if (!isVoice) {
              const delay = createDelay(audioContext, 1, 0.33)
              const compressor = createCompressor(audioContext)
              track.out.connect(compressor.in)
              compressor.out.connect(delay.in)
              delay.out.connect(audioContext.destination)
            } else {
              const delay = createDelay(audioContext, 0.5, 0.22)
              track.out.connect(delay.in)
              delay.out.connect(audioContext.destination)
            }

            audioEl.addEventListener('ended', () => {
              audioEl.remove()
            })
            audioEl.play()
            oldTrack = track
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
