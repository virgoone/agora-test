import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Radio, Drawer, Select } from 'antd'
import { FormState, resolutions } from '@/hooks/useForm'

const { Option } = Select

type Props = {
  visible: boolean
  cameraList: MediaDeviceInfo[]
  microphoneList: MediaDeviceInfo[]
  columns?: number
  values?: FormState
  onClose: () => void
  onChange?: (type: string, value: any) => void
}

const AdvanceSetting: React.FunctionComponent<Props> = (props): JSX.Element => {
  const [form] = Form.useForm()
  const {
    cameraList,
    microphoneList,
    onClose,
    visible,
    values,
    onChange,
  } = props

  useEffect(() => {
    form.setFieldsValue(values)
  }, [values])

  const onValuesChange = (changedValues: any) => {
    const type = Object.keys(changedValues)[0]
    onChange?.(type, changedValues[type])
  }

  return (
    <Drawer
      title="ADVANCED SETTINGS"
      placement="right"
      width={520}
      closable={false}
      keyboard={false}
      onClose={onClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Close
          </Button>
        </div>
      }
    >
      <Form layout="vertical" onValuesChange={onValuesChange} form={form}>
        <Form.Item name="uid" label="UID">
          <Input type="number" placeholder="Please enter uid" />
        </Form.Item>
        <Form.Item name="cameraId" label="Camera">
          <Select placeholder="Please choose the Camera">
            {cameraList.map((item) => (
              <Option key={item.deviceId} value={item.deviceId}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="microphoneId" label="Microphone">
          <Select placeholder="Please choose the microphone">
            {microphoneList.map((item) => (
              <Option key={item.deviceId} value={item.deviceId}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="resolutionId" label="Resolution">
          <Select placeholder="Please choose the resolution">
            {resolutions.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="mode" label="Mode">
          <Radio.Group>
            <Radio value="live">live</Radio>
            <Radio value="rtc">rtc</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="codec" label="Codec">
          <Radio.Group>
            <Radio value="h264">h264</Radio>
            <Radio value="vp8">vp8</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AdvanceSetting
