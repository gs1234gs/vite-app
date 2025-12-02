// src/upload/UploadImage.tsx
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

// 模拟上传 API（你已有）
const uploadImageApi = async (formData: FormData) => {
  try {
    const response = await fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data?.url) {
      return data;
    }
    return null;
  } catch (error) {
    message.error('上传失败');
    return null;
  }
};

interface UploadImageProps {
  value?: string; // 外部传入的图片 URL（用于回显）
  onChange?: (url: string | null) => void; // 通知父组件新 URL
}

const UploadImage: React.FC<UploadImageProps> = ({ value, onChange }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 🔄 当 value 变化时（如编辑回显），同步 fileList
  useEffect(() => {
    if (value) {
      setFileList([
        {
          uid: '-1',
          name: 'avatar.png',
          status: 'done',
          url: value,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只允许上传图片文件!');
      return Upload.LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadImageApi(formData);

    if (response?.url) {
      const newFile: UploadFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: response.url,
      };
      setFileList([newFile]);
      onChange?.(response.url); // ✅ 通知父组件新 URL
    } else {
      message.error('上传失败');
    }

    return false; // 阻止默认上传
  };

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    // 如果用户点击了删除按钮
    if (file?.status === 'removed') {
      setFileList([]);
      onChange?.(null); // 清空值
    }
    // 注意：我们主要靠 beforeUpload 控制上传，这里只处理删除
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  );

  return (
    <>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={handleBeforeUpload}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadImage;