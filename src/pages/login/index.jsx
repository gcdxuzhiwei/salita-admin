import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { message, Input, Checkbox, Button } from 'antd';
import axios from 'axios';
import { GithubOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { logo } from '@/utils/const';
import styles from './index.less';

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem('shouldLogin')) {
      message.info('请先登录');
      window.sessionStorage.removeItem('shouldLogin');
    }
  }, []);

  const handleClick = async () => {
    if (!name || !password) {
      message.error('请输入用户名和密码');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/login', {
        user: name,
        password,
        save: check,
      });
      if (data.success) {
        history.push('/');
      } else {
        message.error(data.err);
      }
      setLoading(false);
    } catch {
      message.error('网络异常');
    }
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.logo}>
          <img src={logo} /> 家教服务平台后台管理
        </div>
        <Input
          size="large"
          placeholder="请输入用户名"
          prefix={<UserOutlined />}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          size="large"
          placeholder="请输入密码"
          type="password"
          prefix={<LockOutlined />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className={styles.checkbox}>
          <Checkbox
            checked={check}
            onChange={(e) => {
              setCheck(e.target.checked);
            }}
          >
            七天免登录
          </Checkbox>
        </div>
        <Button
          style={{ width: '100%' }}
          type="primary"
          size="large"
          onClick={handleClick}
          loading={loading}
        >
          登录
        </Button>
      </div>
      <div className={styles.foot}>
        <div>
          <a
            href="https://github.com/gcdxuzhiwei"
            target="_blank"
            title="github"
          >
            <GithubOutlined />
          </a>
        </div>
        <div>powered by xuzhiwei</div>
      </div>
    </>
  );
}

export default Login;
