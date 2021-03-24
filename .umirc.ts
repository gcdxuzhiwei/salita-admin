import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  title: '家教服务平台后台管理',
  proxy: {
    '/api/upload': {
      target: 'http://xzw.link/',
      changeOrigin: true,
    },
    '/api': {
      target: 'http://127.0.0.1:7001/',
      changeOrigin: true,
    },
    '/public': {
      target: 'http://xzw.link/',
      changeOrigin: true,
    },
  },
  devServer: {
    port: 8001,
  },
  favicon:
    'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png',
  hash: true,
  routes: [
    {
      path: '/login',
      exact: true,
      component: '@/pages/login',
    },
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
        {
          path: 'adminSetting',
          component: '@/pages/admin/setting',
        },
        {
          path: 'adminInfo',
          component: '@/pages/admin/info',
        },
      ],
    },
  ],
  fastRefresh: {},
});
