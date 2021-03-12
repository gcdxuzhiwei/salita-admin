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
      target: 'http://xzw.link/',
      changeOrigin: true,
    },
  },
  devServer: {
    port: 8001,
  },
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
