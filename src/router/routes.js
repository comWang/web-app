import { BasicLayout, PageView, BlankLayout } from '@/layouts'

const layouts = {
  BasicLayout,
  PageView,
  BlankLayout,
  RouterView: {
    // eslint-disable-next-line
    render(h) {
      return <router-view />
    },
  },
}

export default [
  {
    path: '/',
    component: layouts.BasicLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: layouts.PageView,
        meta: {
          activeIcon: 'home-active',
          icon: 'home',
          desc: '首页',
        },
        redirect: '/home/overview',
        children: [
          {
            path: 'overview',
            component: () => import('@/views/index-page/Index'),
            meta: {
              desc: '首页概览',
            },
          },
        ],
      },
      {
        path: 'create',
        component: layouts.PageView,
        meta: {
          activeIcon: 'pen-active',
          icon: 'pen',
          desc: '创作',
        },
        redirect: '/create/article',
        children: [
          {
            path: 'article',
            component: null,
            meta: {
              desc: '文章',
            },
          },
          {
            path: 'course',
            component: null,
            meta: {
              desc: '单品课程',
            },
          },
          {
            path: 'coursePkg',
            component: null,
            meta: {
              desc: '课程包',
            },
          },
        ],
      },
      {
        path: 'manage',
        component: layouts.PageView,
        meta: {
          activeIcon: 'valve-active',
          icon: 'valve',
          desc: '管理',
        },
        redirect: '/manage/content',
        children: [
          {
            path: 'content',
            component: null,
            meta: {
              desc: '作品管理',
            },
          },
          {
            path: 'remark',
            component: null,
            meta: {
              desc: '评论管理',
            },
          },
        ],
      },
      {
        path: 'data',
        component: layouts.PageView,
        meta: {
          activeIcon: 'clock-active',
          icon: 'clock',
          desc: '数据',
        },
        redirect: '/data/content',
        children: [
          {
            path: 'content',
            component: null,
            meta: {
              desc: '作品数据',
            },
          },
          {
            path: 'fans',
            component: null,
            meta: {
              desc: '粉丝数据',
            },
          },
        ],
      },
    ],
  },
]
