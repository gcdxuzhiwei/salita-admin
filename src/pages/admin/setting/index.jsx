import React, { useState, useRef, useEffect } from 'react';
import { Input, Radio, Button, message, Modal, Table } from 'antd';
import { VariableSizeGrid as Grid } from 'react-window';
import ResizeObserver from 'rc-resize-observer';
import classNames from 'classnames';
import axios from 'axios';
import styles from './index.less';

function AdminSetting() {
  const [role, setRole] = useState(1);
  const [userName, setUserName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [remark, setRemark] = useState('');

  const handleAdd = () => {
    if (!userName || !password1 || !password2) {
      message.warn('请先补全信息');
      return;
    }
    if (password2 !== password1) {
      message.warn('两次密码不一致');
      return;
    }
    if (password1.length < 6) {
      message.warn('密码强度低');
      return;
    }
    Modal.confirm({
      content: `确认信息: ${userName} ${
        role === 1 ? '普通管理员' : '超级管理员'
      }`,
      onOk,
    });
  };

  const onOk = async () => {
    try {
      message.loading('添加中');
      const { data } = await axios.post('/api/admin/addAdmin', {
        userName,
        password: password1,
        role,
        remark,
      });
      message.destroy();
      if (data.err) {
        message.error(data.err);
      }
      if (data.success) {
        message.success('添加成功');
        setRole(1);
        setUserName('');
        setPassword1('');
        setPassword2('');
        setRemark('');
      }
    } catch {
      message.fail('网络异常');
    }
  };

  const columns = [
    { title: '用户名', dataIndex: 'userName' },
    { title: '权限', dataIndex: 'role' },
    { title: '备注', dataIndex: 'remark' },
    { title: '添加时间', dataIndex: 'createTime' },
    { title: '操作', dataIndex: 'something' },
  ];

  const data = [
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
    {
      userName: 'dasd',
      role: '1',
      remark: 'dasfd',
      createTime: 'asfasf',
    },
  ];

  return (
    <>
      <div className={styles.add}>
        此行可添加管理员
        <Input
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          placeholder="用户名"
        />
        <Input
          value={password1}
          onChange={(e) => {
            setPassword1(e.target.value);
          }}
          placeholder="密码"
          type="password"
        />
        <Input
          value={password2}
          onChange={(e) => {
            setPassword2(e.target.value);
          }}
          placeholder="确认密码"
          type="password"
        />
        <Input
          value={remark}
          onChange={(e) => {
            setRemark(e.target.value);
          }}
          placeholder="备注(选填)"
        />
        <Radio.Group
          onChange={(e) => {
            setRole(e.target.value);
          }}
          value={role}
        >
          <Radio value={1}>普通管理员</Radio>
          <Radio value={2}>超级管理员</Radio>
        </Radio.Group>
        <Button onClick={handleAdd} type="primary">
          提交
        </Button>
      </div>
      <VirtualTable columns={columns} dataSource={data} scroll={{ y: 300 }} />
    </>
  );
}

export default AdminSetting;

function VirtualTable(props) {
  const { columns, scroll } = props;
  const [tableWidth, setTableWidth] = useState(0);

  const widthColumnCount = columns.filter(({ width }) => !width).length;
  const mergedColumns = columns.map((column) => {
    if (column.width) {
      return column;
    }

    return {
      ...column,
      width: Math.floor(tableWidth / widthColumnCount),
    };
  });

  const gridRef = useRef();
  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: (scrollLeft) => {
        if (gridRef.current) {
          gridRef.current.scrollTo({ scrollLeft });
        }
      },
    });

    return obj;
  });

  const resetVirtualGrid = () => {
    gridRef.current.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: false,
    });
  };

  useEffect(() => resetVirtualGrid, [tableWidth]);

  const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
    ref.current = connectObject;
    const totalHeight = rawData.length * 54;

    return (
      <Grid
        ref={gridRef}
        className="virtual-grid"
        columnCount={mergedColumns.length}
        columnWidth={(index) => {
          const { width } = mergedColumns[index];
          return totalHeight > scroll.y && index === mergedColumns.length - 1
            ? width - scrollbarSize - 1
            : width;
        }}
        height={scroll.y}
        rowCount={rawData.length}
        rowHeight={() => 54}
        width={tableWidth}
        onScroll={({ scrollLeft }) => {
          onScroll({ scrollLeft });
        }}
      >
        {({ columnIndex, rowIndex, style }) => (
          <div
            className={classNames('virtual-table-cell', {
              'virtual-table-cell-last':
                columnIndex === mergedColumns.length - 1,
            })}
            style={style}
          >
            {rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
          </div>
        )}
      </Grid>
    );
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        setTableWidth(width);
      }}
    >
      <Table
        {...props}
        className="virtual-table"
        columns={mergedColumns}
        pagination={false}
        components={{
          body: renderVirtualList,
        }}
      />
    </ResizeObserver>
  );
}
