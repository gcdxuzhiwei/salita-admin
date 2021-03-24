import React, { useEffect, useState } from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  ApartmentOutlined,
  TeamOutlined,
  SwapOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Popover, message, Menu, Spin } from 'antd';
import { history } from 'umi';
import { logo, getUmiCookie } from '@/utils/const';
import styles from './index.less';
import axios from 'axios';

const { SubMenu } = Menu;

const myMenu = [
  {
    key: '/dashboard',
    name: '分析页',
    icon: <DashboardOutlined />,
  },
  {
    key: '/teacher',
    name: '教师管理',
    icon: <ApartmentOutlined />,
    children: [
      {
        key: '/teacherJoin',
        name: '入驻审核',
      },
    ],
  },
  {
    key: '/admin',
    name: '管理员信息',
    icon: <TeamOutlined />,
    children: [
      {
        key: '/adminSetting',
        name: '管理员设置',
        needAuthor: true,
      },
      {
        key: '/adminInfo',
        name: '个人信息',
      },
    ],
  },
];

export default function IndexPage(props: any) {
  const [inlineCollapsed, setInlineCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [login, setLogin] = useState(false);

  const handleMenu = ({ key }: any) => {
    history.push(key);
  };

  useEffect(() => {
    if (!getUmiCookie()) {
      window.sessionStorage.setItem('shouldLogin', 'true');
      history.push('/login');
    } else {
      setLogin(true);
      const hash = props.location.pathname;
      label: for (let i = 0; i < myMenu.length; i++) {
        const child = myMenu[i].children;
        if (child) {
          for (let j = 0; j < child.length; j++) {
            if (child[j].key === hash) {
              setOpenKeys([myMenu[i].key] as never);
              break label;
            }
          }
        }
      }
      getInfo();
    }
  }, []);

  const getInfo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/getRole');
      if (data.role) {
        setAdminInfo(data);
        setLoading(false);
        setIsAdmin(data.role === 2);
      } else {
        message.error(data.err);
      }
    } catch {
      message.error('网络异常');
    }
  };

  const renderContent = () => {
    return (
      <>
        <div
          className={styles.push}
          onClick={() => {
            setOpenKeys((v) => [...new Set([...v, '/admin'])]);
            history.push('/adminInfo');
          }}
        >
          <FormOutlined /> 修改信息
        </div>
        <div
          className={styles.push}
          onClick={() => {
            history.push('/login');
          }}
        >
          <SwapOutlined /> 切换用户
        </div>
      </>
    );
  };

  return (
    <div className={styles.page}>
      <div
        className={styles.logo}
        style={{
          width: inlineCollapsed ? 50 : 200,
          paddingLeft: inlineCollapsed ? 0 : 24,
        }}
      >
        <img src={logo} style={{ width: inlineCollapsed ? 50 : 75 }} />
        {!inlineCollapsed && <span>后台管理</span>}
      </div>
      <div
        className={styles.menuButton}
        style={{
          width: inlineCollapsed ? 50 : 200,
          paddingLeft: inlineCollapsed ? 17 : 24,
        }}
        onClick={() => {
          setInlineCollapsed((v) => !v);
        }}
      >
        {inlineCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <Menu
        mode="inline"
        theme="dark"
        className={styles.menu}
        style={{ width: inlineCollapsed ? 50 : 200 }}
        inlineCollapsed={inlineCollapsed}
        selectedKeys={[props.location.pathname]}
        onClick={handleMenu}
        openKeys={openKeys}
        onOpenChange={(e: any) => {
          setOpenKeys(e);
        }}
      >
        {myMenu.map((v) =>
          v.children ? (
            <SubMenu icon={v.icon} key={v.key} title={v.name}>
              {v.children.map((c) =>
                !c.needAuthor || isAdmin ? (
                  <Menu.Item key={c.key}>{c.name}</Menu.Item>
                ) : (
                  <Menu.Item disabled key={c.key}>
                    {c.name}
                  </Menu.Item>
                ),
              )}
            </SubMenu>
          ) : (
            <Menu.Item icon={v.icon} key={v.key}>
              {v.name}
            </Menu.Item>
          ),
        )}
      </Menu>
      <div style={{ flex: 1, position: 'relative' }}>
        <div className={styles.title}>
          <Popover
            content={renderContent}
            getPopupContainer={(node) => node.parentNode}
          >
            <Spin spinning={loading}>
              {adminInfo && (
                <span className={styles.info}>
                  <img src={'/public/' + adminInfo.avatar} />
                  {(adminInfo.role === 2 ? '超级' : '普通') +
                    '管理员: ' +
                    adminInfo.name}
                </span>
              )}
            </Spin>
          </Popover>
        </div>
        <div className={styles.main}>
          <div style={{ minWidth: 800 }}>
            {login &&
              props.children &&
              React.cloneElement(props.children, {
                inlineCollapsed,
                adminInfo,
                setAdminInfo,
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
