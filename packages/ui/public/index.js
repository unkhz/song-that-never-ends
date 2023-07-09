function createAudioElement(file, volume) {
  const audioEl = document.createElement('audio')
  audioEl.src = `http://127.0.0.1:3000/${file}`
  audioEl.volume = volume
  audioEl.crossOrigin = 'anonymous'
  return audioEl
}

function createEcho(audioContext, track, delay, gainValue) {
  // Now, create a gain node (to control the volume of the echo)
  const gainNode = audioContext.createGain()

  // And a delay node
  const delayNode = audioContext.createDelay(60)

  // The amount of time in seconds for the initial echo delay
  delayNode.delayTime.value = delay

  // The amount of volume reduction for each echo. This is in the range [0.0, 1.0]
  gainNode.gain.value = gainValue

  // Connect the original audio track to the delay, and then the delay to the gain
  track.connect(delayNode).connect(gainNode)

  // Connect the gain back to the delay to create a feedback loop
  gainNode.connect(delayNode)

  return gainNode
}

function crossfade(audioContext, oldGain, newGain, duration) {
  newGain.gain.setValueAtTime(0, audioContext.currentTime)

  // When the crossfade starts, reduce the volume of source 1 to 0 and increase the volume of source 2 to 1
  oldGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)
  newGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + duration)
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
        let oldGain
        if (char.startsWith('play:')) {
          if (!isSnapshot) {
            const audioSrc = char.slice(5)
            const isVoice = audioSrc.startsWith('audio/voice')
            const audioEl = createAudioElement(audioSrc, isVoice ? 1 : 0.33)
            const trackGain = audioContext.createGain()
            audioContext.createMediaElementSource(audioEl).connect(trackGain)
            if (oldGain) {
              crossfade(audioContext, oldGain, trackGain, 1)
            }

            if (!isVoice) {
              createEcho(audioContext, trackGain, 1, 0.62).connect(
                audioContext.destination
              )
            } else {
              createEcho(audioContext, trackGain, 0.5, 0.22).connect(
                audioContext.destination
              )
            }

            audioEl.addEventListener('ended', () => {
              audioEl.remove()
            })
            audioEl.play()
            oldGain = trackGain
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
