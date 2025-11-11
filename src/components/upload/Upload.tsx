import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

// 这里是模拟获取后端返回路径的函数
const uploadImageApi = async (formData: FormData) => {
  try {
    const response = await fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log()
    if (data?.url) {
      return data; // 假设返回的数据包含文件的 URL
    } else {
    //   message.error('上传失败');
      return null;
    }
  } catch (error) {
    message.error('上传失败');
    return null;
  }
};

const UploadImage: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 上传前处理：将文件通过 FormData 上传
  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只允许上传图片文件!');
      return Upload.LIST_IGNORE;
    }

    // 创建 FormData 对象并附加文件
    const formData = new FormData();
    formData.append('file', file);  // 将文件附加到 FormData 对象

    // 调用上传接口
    const response = await uploadImageApi(formData);

    if (response?.url) {
      // 上传成功，更新文件列表
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: response.url,  // 后端返回的文件 URL
        },
      ]);
    } else {
      message.error('上传失败');
    }

    // 返回 false 以阻止默认上传行为
    return false;
  };

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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
        // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"  // 你可以替换为真实的后端上传接口
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={handleBeforeUpload}  // 处理上传之前的操作
        maxCount={1}  // 限制只能上传一张图片
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
