/*
 * @Author: Wenzhe
 * @Date: 2020-04-08 16:25:28
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-13 10:22:27
 */
// https://umijs.org/config/
import { defineConfig, utils } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { winPath } = utils; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV, GA_KEY } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  favicon: '/favicon.ico',
  analytics: GA_KEY
  ? {
        ga: GA_KEY,
      }
      : false,
      dva: {
        hmr: true,
      },
      locale: {
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        antd: true,
        baseNavigator: true,
      },
      dynamicImport: {
        loading: '@/components/PageLoading/index',
      },
      targets: {
        ie: 11,
      },
      // umi routes: https://umijs.org/docs/routing
      routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'AreaChartOutlined',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'DashboardOutlined',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/user',
                  name: 'user_manage',
                  icon: 'UserOutlined',
                  component: './General/User/index',
                  authority: ['admin'],
                },
                {
                  path: '/admin/discuss',
                  name: 'discuss_manage',
                  icon: 'ReadOutlined',
                  component: './General/Discuss/index',
                  authority: ['admin'],
                },
              ],
            },
            {
              path: '/problem',
              name: 'problem',
              icon: 'ContainerOutlined',
              // component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/problem/list',
                  name: 'list',
                  icon: 'OrderedListOutlined',
                  component: './problem/problemList',
                  authority: ['admin'],
                },
                {
                  name: 'problemForm',
                  icon: 'FormOutlined',
                  path: '/problem/create',
                  component: './problem/problemForm',
                },
                {
                  path: '/problem/update/:id',
                  component: './problem/problemFormUpdate',
                },
              ],
            },
            {
              path: '/contest',
              name: 'contest',
              icon: 'CalculatorOutlined',
              // component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/contest/list',
                  name: 'list',
                  icon: 'OrderedListOutlined',
                  component: './contest/contestList',
                  authority: ['admin'],
                },
                {
                  name: 'contestForm',
                  icon: 'FormOutlined',
                  path: '/contest/create',
                  component: './contest/contestForm',
                },
                {
                  path: '/contest/update/:id',
                  component: './contest/contestForm',
                },
                {
                  path: '/contest/problem/:cid',
                  component: './contest/contestProblem',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    modules: {
      getLocalIdent: (context, _, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }

        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a) => a.replace(/([A-Z])/g, '-$1'))
            .map((a) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }

        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
});
