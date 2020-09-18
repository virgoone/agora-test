import { useState, useEffect } from 'react'
import { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import { notification } from 'antd'
import { remove } from 'lodash-es'

const useRemote = (
  agoraClient: IAgoraRTCClient | undefined,
  uid: string,
) => {
  const [remoteList, setRemoteList] = useState<IAgoraRTCRemoteUser[]>([])

  useEffect(() => {
    if (!agoraClient) {
      return
    }
    const onUserPublished = async (
      remoteUser: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video',
    ) => {
      await agoraClient.subscribe(remoteUser, mediaType)

      if (mediaType === 'video') {
        console.log('subscribe video success')
        notification['success']({
          message: `subscribe success, uid:${remoteUser.uid} `,
        })
      }
      if (mediaType === 'audio') {
        console.log('subscribe audio success')
      }
      if (remoteUser.uid !== uid) {
        setRemoteList([...remoteList, remoteUser])
      }
    }
    const onUserUnPublished = async (
      remoteUser: IAgoraRTCRemoteUser,
      mediaType: 'audio' | 'video',
    ) => {
      if (mediaType === 'video') {
        remoteUser.videoTrack?.stop()
      }
      setRemoteList(
        remove(
          remoteList,
          (user: IAgoraRTCRemoteUser) => user.uid === remoteUser.uid,
        ),
      )
    }
    const onUserLeave = async (
      remoteUser: IAgoraRTCRemoteUser,
      reason: string,
    ) => {
      notification['info']({
        message: `user leave, uid:${remoteUser.uid} `,
      })
      await agoraClient.unsubscribe(remoteUser)
      setRemoteList(
        remove(
          remoteList,
          (user: IAgoraRTCRemoteUser) => user.uid === remoteUser.uid,
        ),
      )
    }
    agoraClient.on('user-published', onUserPublished)
    agoraClient.on('user-unpublished', onUserUnPublished)
    agoraClient.on('user-left', onUserLeave)

    return () => {
      agoraClient.off('user-published', onUserPublished)
      agoraClient.off('user-unpublished', onUserUnPublished)
      agoraClient.off('user-left', onUserLeave)
    }
  }, [agoraClient, remoteList])

  return remoteList
}

export default useRemote
