// src/components/upload/UploadsFile.tsx
import React, { useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, message, Image } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { uploadApi } from '@/api/upload/Upload';
import { HttpStatusCode } from 'axios';

type UploadsAppProps = {
  value?: string[];
  onChange?: (picList: string[]) => void;
  maxCount?: number;
  accept?: string;
  disabled?: boolean; // 添加 disabled 支持
};

const uploadImagesApi = async (formData: FormData) => {
  try {
    const res = await uploadApi(formData);
    if (res.code !== HttpStatusCode.Ok) {
      // message.error('文件上传失败: ' + (res.msg || '未知错误'));
      return null;
    }
    return res.data; // 假设返回 string[]
  } catch (error) {
    message.error('上传失败');
    console.error('上传失败', error);
    return null;
  }
};

const UploadsApp: React.FC<UploadsAppProps> = ({
  value = [],
  onChange,
  maxCount = 8,
  accept = 'image/*',
  disabled = false,
}) => {
  // ✅ 完全由 value 派生 fileList，无需 useState + useEffect
  const fileList = useMemo<UploadFile[]>(() => {
    return (Array.isArray(value) ? value : []).map(url => ({
      uid: url, // ✅ 稳定 uid
      name: url.substring(url.lastIndexOf('/') + 1) || 'unknown',
      status: 'done',
      url,
      response: { filePath: url },
    }));
  }, [value]);

  // 图片预览状态
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (value.length >= maxCount) {
      message.warning(`最多只能上传 ${maxCount} 个文件`);
      return Upload.LIST_IGNORE;
    }

    const formData = new FormData();
    formData.append('file', file);

    const urlList = await uploadImagesApi(formData);

    if (Array.isArray(urlList) && urlList[0]) {
      const newUrl = urlList[0];
      const updatedUrls = [...value, newUrl];
      onChange?.(updatedUrls);
    } 
    return Upload.LIST_IGNORE;
  };

  const handleRemove = (file: UploadFile) => {
    const urlToRemove = file.url || (file.response?.filePath as string);
    if (!urlToRemove) return;

    const updatedUrls = value.filter(url => url !== urlToRemove);
    onChange?.(updatedUrls);
  };

  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      return;
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
        onRemove={handleRemove}
        onPreview={handlePreview}
        accept={accept}
        disabled={disabled}
      >
        {fileList.length < maxCount && uploadButton}
      </Upload>
      
      {/* 图片预览 */}
      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewVisible,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewVisible(visible),
        }}
      />
    </>
  );
};

export default UploadsApp;