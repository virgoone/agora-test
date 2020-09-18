import { useReducer, useState } from 'react'

const resolutions = [
  {
    name: 'Default',
    value: 'default',
  },
  {
    name: '480p',
    value: '480p',
  },
  {
    name: '720p',
    value: '720p',
  },
  {
    name: '1080p',
    value: '1080p',
  },
]
const defaultState = {
  appId: '',
  channel: '',
  token: '',
  uid: '123123123',
  cameraId: '',
  microphoneId: '',
  resolutionId: resolutions[0].value,
  mode: 'live',
  codec: 'h264',
}
export type FormState = typeof defaultState

const reducer = (
  state: FormState,
  action: { type: string; [propName: string]: any },
) => {
  switch (action.type) {
    case 'appId':
      return {
        ...state,
        appId: action.value,
      }
    case 'channel':
      return {
        ...state,
        channel: action.value,
      }
    case 'uid':
      return {
        ...state,
        uid: action.value,
      }
    case 'token':
      return {
        ...state,
        token: action.value,
      }
    case 'cameraId':
      return {
        ...state,
        cameraId: action.value,
      }
    case 'microphoneId':
      return {
        ...state,
        microphoneId: action.value,
      }
    case 'resolutionId':
      return {
        ...state,
        resolutionId: action.value,
      }
    case 'mode':
      return {
        ...state,
        mode: action.value,
      }
    case 'codec':
      return {
        ...state,
        codec: action.value,
      }
    default:
      return state
  }
}

const useAgoraForm = (): {
  dispatch: React.Dispatch<{
    [propName: string]: any
    type: string
  }>
  values: FormState
} => {
  const [values, dispatch] = useReducer(reducer, defaultState)

  return {
    values,
    dispatch,
  }
}
export { resolutions }
export default useAgoraForm
