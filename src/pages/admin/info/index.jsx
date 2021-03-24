import React, { useState } from 'react';
import { Button, Upload, message } from 'antd';
import styles from './index.less';
import axios from 'axios';

function AdminInfo(props) {
  const { adminInfo, setAdminInfo } = props;
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const avatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      changeAvatar(info.file.response.url[0]);
    }
  };

  const changeAvatar = async (url) => {
    try {
      const { data } = await axios.post('/api/admin/changeAvatar', {
        avatar: url,
      });
      if (data.success) {
        message.success('修改成功');
        setLoading(false);
        setAdminInfo({
          ...adminInfo,
          avatar: url,
        });
      } else {
        message.error(data.err);
      }
    } catch {
      message.error('网络异常');
    }
  };

  return (
    <>
      {adminInfo && (
        <>
          <img
            className={styles.avatarImg}
            src={'/public/' + adminInfo?.avatar}
          />
          <Upload
            name="avatar"
            showUploadList={false}
            action="/api/upload"
            beforeUpload={beforeUpload}
            onChange={avatarChange}
          >
            <Button loading={loading} type="primary">
              修改头像
            </Button>
          </Upload>
        </>
      )}
    </>
  );
}

export default AdminInfo;
