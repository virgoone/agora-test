import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng'
import { useState, useEffect } from 'react'

export const useDevices = (): {
  cameraList: MediaDeviceInfo[]
  microphoneList: MediaDeviceInfo[]
} => {
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([])
  const [microphoneList, setMicrophoneList] = useState<MediaDeviceInfo[]>([])

  useEffect(() => {
    let mounted = true

    const getDevices = async () => {
      const cameras = await AgoraRTC.getCameras()
      const microphones = await AgoraRTC.getMicrophones()

      if (mounted) {
        setCameraList(cameras)
        setMicrophoneList(microphones)
      }
    }

    getDevices()

    return () => {
      mounted = false
    }
  }, [])
  return {
    cameraList,
    microphoneList,
  }
}

export default useDevices
