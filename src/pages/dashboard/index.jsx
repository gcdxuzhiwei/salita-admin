import React, { useEffect, useState, useRef } from 'react';
import echarts from 'echarts';
import { defer } from 'lodash';
import { message, Spin, Progress } from 'antd';
import axios from 'axios';
import styles from './index.less';

let chart1;
let chart2;
let chart3;

function Dashboard(props) {
  const { inlineCollapsed } = props;
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);

  const chart1DOM = useRef(null);
  const chart2DOM = useRef(null);
  const chart3DOM = useRef(null);

  useEffect(() => {
    getAction();

    window.addEventListener('resize', onresize);

    return () => {
      window.removeEventListener('resize', onresize);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      onresize();
    }, 250);
  }, [inlineCollapsed]);

  const onresize = () => {
    if (chart1 && chart2 && chart3) {
      chart1.resize();
      chart2.resize();
      chart3.resize();
      chart1.resize();
      chart2.resize();
      chart3.resize();
    }
  };

  const getAction = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/admin/getAction');
      if (data.err) {
        message.error(data.err);
      } else {
        const { arr, count } = data;
        setPercent((arr[arr.length - 1].online / count) * 100);
        setLoading(false);
        defer(() => {
          chart1 = echarts.init(chart1DOM.current);
          chart2 = echarts.init(chart2DOM.current);
          chart3 = echarts.init(chart3DOM.current);
          chart1.setOption({
            color: '#91cc75',
            title: {
              left: 45,
              top: 10,
              text: '近期注册用户数',
              textStyle: {
                fontSize: 13,
                fontWeight: 400,
              },
            },
            grid: {
              left: 50,
              right: 15,
              top: 45,
              bottom: 45,
            },
            tooltip: {
              show: true,
              trigger: 'axis',
            },
            xAxis: {
              type: 'category',
              data: arr.map((v) => v.day),
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              splitLine: {
                show: true,
              },
            },
            yAxis: {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
            },
            series: [
              {
                data: arr.map((v) => v.register),
                type: 'line',
                smooth: true,
              },
            ],
          });
          chart2.setOption({
            color: '#AC3B2A',
            title: {
              left: 45,
              top: 10,
              text: '近期用户接口调用数',
              textStyle: {
                fontSize: 13,
                fontWeight: 400,
              },
            },
            grid: {
              left: 50,
              right: 15,
              top: 45,
              bottom: 45,
            },
            tooltip: {
              show: true,
              trigger: 'axis',
            },
            xAxis: {
              type: 'category',
              data: arr.map((v) => v.day),
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              splitLine: {
                show: true,
              },
            },
            yAxis: {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
            },
            series: [
              {
                data: arr.map((v) => v.action),
                type: 'line',
                smooth: true,
              },
            ],
          });
          chart3.setOption({
            color: '#FBDB0F',
            title: {
              left: 45,
              top: 10,
              text: '近期登录用户数',
              textStyle: {
                fontSize: 13,
                fontWeight: 400,
              },
            },
            grid: {
              left: 50,
              right: 15,
              top: 45,
              bottom: 45,
            },
            tooltip: {
              show: true,
              trigger: 'axis',
            },
            xAxis: {
              type: 'category',
              data: arr.map((v) => v.day),
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              splitLine: {
                show: true,
              },
            },
            yAxis: {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
            },
            series: [
              {
                data: arr.map((v) => v.online),
                type: 'line',
                smooth: true,
              },
            ],
          });
        });
      }
    } catch {
      message.error('网络异常');
    }
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.top}>
        {!loading && (
          <>
            <div className={styles.left}>
              <div className={styles.tool}>今日活跃用户占比</div>
              <Progress type="circle" percent={percent.toFixed(0)} />
            </div>
            <div className={styles.right}>
              <div ref={chart1DOM}></div>
              <div ref={chart2DOM}></div>
              <div ref={chart3DOM}></div>
            </div>
          </>
        )}
      </div>
    </Spin>
  );
}

export default Dashboard;
