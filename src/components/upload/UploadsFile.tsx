import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { uploadApi } from '@/api/upload/Upload';
import { HttpStatusCode } from 'axios';

// 模拟上传API
const uploadImagesApi = async (formData: FormData) => {
  try {
    const res = await uploadApi(formData);
    if (res.code !== HttpStatusCode.Ok) {
      message.error('文件上传失败: ' + (res.msg || '未知错误'));
      return null;
    }
    return res.data;  // 返回多个文件URL
  } catch (error) {
    message.error('上传失败');
    console.error('上传失败，请稍后重试', error);
    return null;
  }
};

const UploadsApp: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [mobilePaths, setMobilePaths] = useState<string[]>([]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const urlList = await uploadImagesApi(formData);

    if (urlList && urlList[0]) {
      // 创建一个新的文件对象，包含响应数据
      const newFile = {
        ...file,
        status: 'done',
        response: { filePath: urlList[0] },
        url: urlList[0]
      };
      setFileList(prev => [...prev, newFile as UploadFile]);
      setMobilePaths(prev => [...prev, urlList[0]]);
    } else {
      message.error('上传失败');
    }
    
    return Upload.LIST_IGNORE; // 阻止默认上传行为
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const newMobilePaths: string[] = [];
    for (const file of newFileList) {
      if (file.status === 'done' && file.response) {
        const filePath = file.response.filePath;
        if (filePath) {
          newMobilePaths.push(filePath);
        }
      }
    }

    setMobilePaths(newMobilePaths); // 更新上传后的路径
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
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={handleBeforeUpload}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      <div>
        <h3>上传路径列表：</h3>
        <ul>
          {mobilePaths.map((path, index) => (
            <li key={index}>{path}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UploadsApp;
