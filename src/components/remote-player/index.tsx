import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import { Card } from 'antd'
import React, { useEffect, useRef } from 'react'

type Props = {
  remoteUser: IAgoraRTCRemoteUser
}

const RemotePlayer: React.FunctionComponent<Props> = (props): JSX.Element => {
  const { remoteUser } = props
  const $remotePlayer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    console.log('remoteList--->', remoteUser)

    if (!$remotePlayer.current) {
      return
    }
    remoteUser.videoTrack?.play($remotePlayer.current)
    remoteUser.audioTrack?.play()

    return () => {
      remoteUser.videoTrack?.stop()
      remoteUser.audioTrack?.stop()
    }
  }, [remoteUser])
  return <div ref={$remotePlayer} className="remote-stream-item"></div>
}

export default RemotePlayer
