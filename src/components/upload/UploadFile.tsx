import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { uploadApi } from '@/api/upload/Upload';
import { HttpStatusCode } from 'axios';

// 模拟上传 API（你已有）
const uploadImageApi = async (formData: FormData) => {
  try {
    const res = await uploadApi(formData);
    if (res.code !== HttpStatusCode.Ok) {
      message.error('文件上传失败: ' + (res.msg || '未知错误'));
      return null;
    }
    const urlList: Array<string> = res.data;
    // console.log(urlList)
    return urlList;
  } catch (error) {
    message.error('上传失败');
    console.error('上传失败，稍后重试', error);
    return null;
  }
};

interface UploadImageProps {
  value?: string; // 外部传入的图片 URL（用于回显）
  onChange?: (url: string | null) => void; // 通知父组件新 URL
}

const UploadImage: React.FC<UploadImageProps> = ({ value, onChange }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (value) {
      setFileList([{
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: value,
      }]);
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('只允许上传图片文件!');
      return Upload.LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append('file', file);

    const urlList = await uploadImageApi(formData);

    if (urlList) {
      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: urlList[0], // 使用返回的第一个 URL
      };
      setFileList([newFile]);
      onChange?.(urlList[0]); // ✅ 上传成功后把路径传给父组件
    } else {
      message.error('上传失败');
    }

    return false; // 阻止默认上传
  };

  const handleChange: UploadProps['onChange'] = ({ file }) => {
    if (file.status === 'removed') {
      setFileList([]);
      onChange?.(null); // 删除时清空父组件的值
    }
  };

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        )}
      </Upload>

      <Image
        src={previewImage}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          afterOpenChange: (visible) => !visible && setPreviewImage(''),
        }}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default UploadImage;
