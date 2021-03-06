import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '家教服务平台后台管理',
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:7001/',
      changeOrigin: true,
    },
    '/public': {
      target: 'http://www.xuzhiwei.icu/',
      changeOrigin: true,
    },
  },
  devServer: {
    port: 8001,
  },
  hash: true,
  routes: [
    {
      path: '/',
      exact: true,
      redirect: '/dashboard',
    },
    {
      path: '/',
      component: '@/pages/index',
      routes: [
        {
          path: 'dashboard',
          component: '@/pages/dashboard',
        },
        {
          path: 'teacherJoin',
          component: '@/pages/teacher/join',
        },
      ],
    },
  ],
  fastRefresh: {},
});
