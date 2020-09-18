import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng'
import { notification } from 'antd'
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
      try {
        const cameras = await AgoraRTC.getCameras()
        const microphones = await AgoraRTC.getMicrophones()

        if (mounted) {
          setCameraList(cameras)
          setMicrophoneList(microphones)
        }
      } catch (error) {
        notification['error']({
          message: 'get permission failed',
        })
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
