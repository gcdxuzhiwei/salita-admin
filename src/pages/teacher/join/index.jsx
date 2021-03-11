import React, { useEffect, useRef, useState } from 'react';
import { Table, message, Image, Modal } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
import styles from './index.less';

function Join() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTable();
  }, [page]);

  const columns = useRef([
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '家教身份',
      dataIndex: 'isTeacher',
      render: (text) => (text === 1 ? '教师' : '学生'),
    },
    {
      title: '学校',
      dataIndex: 'school',
    },
    {
      title: '专业',
      dataIndex: 'profession',
    },
    {
      title: '学历',
      dataIndex: 'level',
      render: (text) => (text === 1 ? '研究生' : '本科'),
    },
    {
      title: '认证图片',
      dataIndex: 'imageUrl',
      render: (text) => <Image src={'/public/' + text} />,
    },
    {
      title: '操作',
      render: (text, record) => (
        <>
          <CloseOutlined
            onClick={() => {
              handleClickIcon(true, record);
            }}
            className={styles.leftIcon}
          />
          <CheckOutlined
            onClick={() => {
              handleClickIcon(false, record);
            }}
            className={styles.rightIcon}
          />
        </>
      ),
    },
  ]);

  const handleClickIcon = (close, record) => {
    const option = {
      content: close ? '审核不通过?' : '审核通过?',
      maskClosable: true,
      closable: true,
      onOk: async () => {
        try {
          message.loading('请稍等');
          const { data } = await axios.post('/api/admin/changeJoinState', {
            canJoin: !close,
            userId: record.userId,
          });
          message.destroy();
          message.success('操作成功');
          getTable();
        } catch {
          message.error('网络异常');
        }
      },
    };
    close ? Modal.error(option) : Modal.success(option);
  };

  const getTable = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/getJoinTable', {
        page,
      });
      const { res, count } = data;
      setDataSource(res);
      setTotal(count);
      setLoading(false);
    } catch {
      message.error('网络异常');
    }
  };

  return (
    <Table
      className={styles.table}
      loading={loading}
      rowKey={(record) => record.userId}
      columns={columns.current}
      dataSource={dataSource}
      pagination={{
        current: page,
        pageSize: 10,
        total: total,
        onChange: (page) => {
          setPage(page);
        },
      }}
    />
  );
}

export default Join;
