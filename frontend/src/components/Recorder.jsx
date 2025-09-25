import React, { useState, useRef } from 'react'

export default function Recorder({ onRecorded }) {
  const [rec, setRec] = useState(false)
  const [permission, setPermission] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])

  async function askPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermission(true)
      mediaRef.current = new MediaRecorder(stream)
      mediaRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }
      mediaRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []
        onRecorded(blob)
      }
    } catch (err) {
      console.error('Mic permission denied', err)
    }
  }

  const start = async () => {
    if (!permission) await askPermission()
    mediaRef.current.start()
    setRec(true)
  }
  const stop = () => {
    mediaRef.current.stop()
    setRec(false)
  }

  return (
    <div className="flex items-center gap-2">
      {!rec ? (
        <button onClick={start} className="px-3 py-1 bg-emerald-500 text-white rounded">Record</button>
      ) : (
        <button onClick={stop} className="px-3 py-1 bg-red-500 text-white rounded">Stop</button>
      )}
    </div>
  )
}
