import React, { useEffect, useRef, useState } from 'react'
import {
  Spin,
  Layout,
  Row,
  Col,
  Card,
  Tooltip,
  Button,
  Input,
  Form,
  notification,
} from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import AdvanceSetting from '@/components/advance-settings'
import useForm from '@/hooks/useForm'
import useDevices from '@/hooks/useDevices'
import '@/style/common.less'
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng'

const { Header, Content } = Layout

const App: React.FunctionComponent = (): JSX.Element => {
  const [form] = Form.useForm()
  const [isJoin, setIsJoin] = useState<boolean>(false)
  const [isPublished, setIsPublished] = useState(false)

  const [
    localVideoTrack,
    setLocalVideoTrack,
  ] = useState<ICameraVideoTrack | null>(null)
  const [
    localAudioTrack,
    setLocalAudioTrack,
  ] = useState<IMicrophoneAudioTrack | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [agoraClient, setAgoraClient] = useState<IAgoraRTCClient | undefined>(
    undefined,
  )
  const [visible, setVisible] = useState<boolean>(false)
  const { values, dispatch } = useForm()
  const { cameraList, microphoneList } = useDevices()

  useEffect(() => {
    if (!values.cameraId && cameraList.length > 0) {
      dispatch({ type: 'cameraId', value: cameraList[0].deviceId })
    }
    if (!values.microphoneId && microphoneList.length > 0) {
      dispatch({ type: 'microphoneId', value: microphoneList[0].deviceId })
    }
  }, [cameraList, microphoneList])

  const onValuesChange = (changedValues: any) => {
    const type = Object.keys(changedValues)[0]
    dispatch({ type, value: changedValues[type] })
  }

  useEffect(() => {
    form.setFieldsValue(values)
  }, [values])

  const onJoin = async () => {
    await form.validateFields()
    const { mode, codec, uid, appId, channel, token } = values

    const client = AgoraRTC.createClient({
      mode,
      codec,
    })

    setLoading(true)
    setAgoraClient(client)
    setIsJoin(true)

    const userId = uid || '123456'

    await client.join(appId, channel, token, userId)

    notification['success']({
      message: `Joined channel: ${values.channel}, uid: ${userId}`,
    })

    const localAudio = await AgoraRTC.createMicrophoneAudioTrack()
    const localVideo = await AgoraRTC.createCameraVideoTrack()

    await localVideo.setBeautyEffect(true, {
      lighteningContrastLevel: 1,
      lighteningLevel: 0.7,
      smoothnessLevel: 0.5,
      rednessLevel: 0.1,
    })

    console.log('create local audio/video track success')
    console.log('set Beauty Effect Options success!')

    localVideo.play('local-player')

    setLocalVideoTrack(localVideo)
    setLocalAudioTrack(localAudio)

    try {
      mode === 'live' && (await client.setClientRole('host'))
      await client.publish([localAudio, localVideo])
      setIsPublished(true)
      notification['success']({ message: `published: ${values.channel}` })
    } catch (e) {
      setIsPublished(false)
      console.log('publish failed', e)
    }
    setLoading(false)
  }

  const onLeave = async () => {
    await form.validateFields()

    if (!agoraClient || !isJoin) {
      notification['error']({ message: 'Please Join First!' })
      return
    }
    setLoading(true)

    try {
      await agoraClient?.leave()
      localVideoTrack?.stop()
      localAudioTrack?.stop()
      localVideoTrack?.setEnabled(false)
      setIsJoin(false)
      notification['success']({
        message: 'Leave success',
      })
    } catch (error) {
      notification['error']({ message: 'Error', description: error })
    } finally {
      setLoading(false)
    }
  }

  const onPublish = async () => {
    await form.validateFields()

    if (!agoraClient || !isJoin || !localVideoTrack || !localAudioTrack) {
      notification['error']({ message: 'Please Join Room First!' })
      return
    }

    if (isPublished) {
      notification['error']({ message: 'Your already published' })
      return
    }
    try {
      await agoraClient.publish([localVideoTrack, localAudioTrack])
      notification['success']({ message: 'published' })
    } catch (error) {
      notification['error']({ message: 'publish failed', description: error })
    }
  }

  const onUnPublish = async () => {
    await form.validateFields()

    if (!agoraClient || !isJoin || !localVideoTrack || !localAudioTrack) {
      notification['error']({ message: 'Please Join Room First!' })
      return
    }
    if (!isPublished) {
      notification['error']({ message: "Your didn't publish" })
      return
    }
    try {
      await agoraClient.unpublish([localVideoTrack, localAudioTrack])
      notification['success']({ message: 'unpublished' })
    } catch (error) {
      notification['error']({ message: 'unpublish failed', description: error })
    }
  }

  useEffect(() => {
    if (!agoraClient) {
      return
    }
    agoraClient.on('user-published', async (remoteUser, mediaType) => {
      await agoraClient.subscribe(remoteUser, mediaType)
      if (mediaType === 'video') {
        console.log('subscribe video success')
        remoteUser.videoTrack?.play('remote-player')
      }
      if (mediaType === 'audio') {
        console.log('subscribe audio success')
        remoteUser.audioTrack?.play()
      }
    })

    agoraClient.on('user-unpublished', (user, mediaType) => {
      if (mediaType === 'video') {
        // 获取刚刚动态创建的 DIV 节点。
        user.videoTrack?.stop()
      }
    })
  }, [agoraClient])

  return (
    <Spin spinning={loading} tip="Loading...">
      <Layout className="app">
        <Header className="header">Agora Test</Header>
        <Content style={{ padding: '0 50px' }}>
          <Row gutter={16}>
            <Col span={10}>
              <Card>
                <Form
                  onValuesChange={onValuesChange}
                  form={form}
                  layout="vertical"
                >
                  <Form.Item
                    name="appId"
                    label="App ID"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="App ID" />
                  </Form.Item>
                  <Form.Item
                    name="channel"
                    label="Channel"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="channel" />
                  </Form.Item>
                  <Form.Item
                    name="token"
                    label="Token"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="token" />
                  </Form.Item>
                  <Form.Item>
                    {isJoin ? (
                      <Button
                        className="form-button"
                        type="primary"
                        onClick={onLeave}
                      >
                        Leave
                      </Button>
                    ) : (
                      <Button
                        className="form-button"
                        type="primary"
                        onClick={onJoin}
                      >
                        Join
                      </Button>
                    )}
                    <Button
                      className="form-button"
                      type="primary"
                      onClick={onPublish}
                    >
                      Publish
                    </Button>
                    <Button
                      className="form-button"
                      type="primary"
                      onClick={onUnPublish}
                    >
                      UnPublish
                    </Button>
                  </Form.Item>
                </Form>
                <Tooltip title="ADVANCED SETTINGS">
                  <Button
                    onClick={() => setVisible(true)}
                    className="setting-icon"
                    shape="circle"
                    icon={<SettingOutlined />}
                  />
                </Tooltip>
              </Card>
            </Col>
            <Col span={14}>
              <Card>
                <div
                  className="video-stream local-stream"
                  id="local-player"
                ></div>
              </Card>
              <Card>
                <div
                  className="video-stream remote-stream"
                  id="remote-player"
                ></div>
              </Card>
            </Col>
          </Row>
        </Content>
        <AdvanceSetting
          cameraList={cameraList}
          microphoneList={microphoneList}
          values={values}
          visible={visible}
          onClose={() => setVisible(false)}
          onChange={(type: string, value: any) => {
            dispatch({ type, value })
          }}
        />
      </Layout>
    </Spin>
  )
}

export default App