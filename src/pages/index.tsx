import React, { useEffect, useState } from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { logo } from '@/utils/const';
import styles from './index.less';
import { Menu } from 'antd';

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
];

export default function IndexPage(props: any) {
  const [inlineCollapsed, setInlineCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  const handleMenu = ({ key }: any) => {
    history.push(key);
  };

  useEffect(() => {
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
  }, []);

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
            <SubMenu key={v.key} title={v.name}>
              {v.children.map((c) => (
                <Menu.Item key={c.key}>{c.name}</Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item key={v.key}>{v.name}</Menu.Item>
          ),
        )}
      </Menu>
      <div style={{ flex: 1, position: 'relative' }}>
        <div className={styles.title}></div>
        <div className={styles.main}>
          <div style={{ minWidth: 800 }}>{props.children}</div>
        </div>
      </div>
    </div>
  );
}
