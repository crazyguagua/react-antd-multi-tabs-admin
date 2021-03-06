import React from 'react'
import { Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import $axios from '@/utils/axios'

interface Props {
  onChange?: (arg0: string) => void;
  value?: string;
  accept?: any;
  size?: number;
}
interface States {
  loading: boolean;
}

class MyUpload extends React.Component<Props, States> {
  constructor(props: Readonly<Props>) {
    super(props)
    this.state = {
      loading: false
    }
  }

  render() {
    const {
      onChange,
      value,
      accept = ['jpg', 'jpeg', 'png', 'gif'],
      size = 5
    } = this.props
    const { loading } = this.state
    const uploadButton = loading ? <LoadingOutlined /> : <PlusOutlined />

    const onStart = (): void => {
      this.setState({
        loading: true
      })
      onChange('')
    }

    const onSuccess = ({ path }: any) => {
      this.setState({
        loading: false
      })
      onChange(path)
    }
    const onError = (): void => {}

    const uploadProps: any = {
      action: '/api/common/upload',
      onStart,
      customRequest({ action, file, filename }) {
        const isType = accept.some((item: string) => file.type.includes(item))
        const isSize = file.size / 1024 / 1024 < size
        if (!isType || !isSize) {
          message.error('请上传正确文件')
          return false
        }
        const formData = new FormData()
        formData.append(filename, file)
        $axios
          .post(action, formData)
          .then((res) => {
            onSuccess(res)
          })
          .catch(onError)
        return {
          abort() {
            // console.log('upload progress is aborted.')
          }
        }
      }
    }

    return (
      <Upload
        className="avatar-uploader"
        listType="picture-card"
        showUploadList={false}
        {...uploadProps}
      >
        {value ? (
          <img alt="" src={value} style={{ maxWidth: '100%' }} />
        ) : (
          uploadButton
        )}
      </Upload>
    )
  }
}

export default MyUpload
