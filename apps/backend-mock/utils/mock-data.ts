export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'Vben',
    roles: ['super'],
    username: 'vben',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
  },
];

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'vben',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    component: 'BasicLayout',
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.adminVisible',
      },
      name: 'AccessAdminVisibleDemo',
      path: '/demos/access/admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.superVisible',
      },
      name: 'AccessSuperVisibleDemo',
      path: '/demos/access/super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.userVisible',
      },
      name: 'AccessUserVisibleDemo',
      path: '/demos/access/user-visible',
    },
  };

  return [
    {
      component: 'BasicLayout',
      meta: {
        icon: 'ic:baseline-view-in-ar',
        keepAlive: true,
        order: 1000,
        title: 'demos.title',
      },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
      children: [
        {
          name: 'AccessDemos',
          path: '/demosaccess',
          meta: {
            icon: 'mdi:cloud-key-outline',
            title: 'demos.access.backendPermissions',
          },
          redirect: '/demos/access/page-control',
          children: [
            {
              name: 'AccessPageControlDemo',
              path: '/demos/access/page-control',
              component: '/demos/access/index',
              meta: {
                icon: 'mdi:page-previous-outline',
                title: 'demos.access.pageAccess',
              },
            },
            {
              name: 'AccessButtonControlDemo',
              path: '/demos/access/button-control',
              component: '/demos/access/button-control',
              meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.buttonControl',
              },
            },
            {
              name: 'AccessMenuVisible403Demo',
              path: '/demos/access/menu-visible-403',
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'demos.access.menuVisible403',
              },
            },
            roleWithMenus[role],
          ],
        },
      ],
    },
  ];
};

export const MOCK_MENUS = [
  {
    menus: [...dashboardMenus, ...createDemosMenus('super')],
    username: 'vben',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('admin')],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('user')],
    username: 'jack',
  },
];
export const MOCK_CATEGORY = [
  {
    "id": 245,
    "pid": 0,
    "path": "/0/272/",
    "name": "珠宝饰品",
    "type": 1,
    "url": "",
    "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/maintain/2021/12/25/3a395df3d79a40a08cbc938c35e2dc35b84sujo2yn.png",
    "status": true,
    "sort": 1,
    "child": [
      {
        "id": 488,
        "pid": 245,
        "path": "/0/272/245/",
        "name": "耳饰",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/68f53431c0794f3ebdc67969623fd876xhbfvo1gjm.jpg",
        "status": false,
        "sort": 1
      },
      {
        "id": 801,
        "pid": 245,
        "path": "/0/272/245/",
        "name": "项链",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/9f156f901525480887848795b5c5704cb1pcw2jejl.jpg",
        "status": false,
        "sort": 0
      },
      {
        "id": 815,
        "pid": 245,
        "path": "/0/272/245/",
        "name": "手表",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/2687b3cb5ef14c98b8bbb83c847dc3d7vixvx4ae21.jpg",
        "status": false,
        "sort": 0
      },
      {
        "id": 940,
        "pid": 245,
        "path": "/0/272/245/",
        "name": "124",
        "type": 1,
        "url": "",
        "extra": null,
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 272,
    "pid": 0,
    "path": "/0/",
    "name": "鞋靴服饰",
    "type": 1,
    "url": "",
    "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/b763a9009d2d455989a6236e228d72e77p092gglds.jpg",
    "status": true,
    "sort": 1,
    "child": [
      {
        "id": 920,
        "pid": 272,
        "path": "/0/272/",
        "name": "帽子",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/9d016522a9084944b9408bbc6ab3fb04h3pg2ztlot.jpg",
        "status": true,
        "sort": 1000
      },
      {
        "id": 854,
        "pid": 272,
        "path": "/0/272/",
        "name": "外套",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/3d2d219805c64384afc1095a321423743x5z1gyl6c.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 864,
        "pid": 272,
        "path": "/0/272/",
        "name": "短袖",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/72b3ff5024454bedb3ab193797414d10o64aawxzcn.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 873,
        "pid": 272,
        "path": "/0/272/",
        "name": "防晒服",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/a939e1051b7f47a29cb0cba1559daa27tv2tqpvkcw.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 925,
        "pid": 272,
        "path": "/0/272/",
        "name": "1111",
        "type": 1,
        "url": "",
        "extra": null,
        "status": true,
        "sort": 0
      },
      {
        "id": 929,
        "pid": 272,
        "path": "/0/272/",
        "name": "测试分类",
        "type": 1,
        "url": "",
        "extra": null,
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 280,
    "pid": 0,
    "path": "/0/",
    "name": "家居生活",
    "type": 1,
    "url": "",
    "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/maintain/2021/12/25/86f83bdc35534eeda2fb4daeb51dbb28pizkxqnzap.jpg",
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 248,
        "pid": 280,
        "path": "/0/280/",
        "name": "风扇",
        "type": 1,
        "url": "www",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/6001e2cb1e7043d1b05384575ea648e3mku5u7vnvf.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 285,
        "pid": 280,
        "path": "/0/280/",
        "name": "枕头",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/19bc75a0ceea4dc0a3db558bcdff9a1d5ccn6yggvs.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 286,
        "pid": 280,
        "path": "/0/280/",
        "name": "箱包",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/2b68d02de7244240a71fbb232bacff97gdcuh2fexk.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 287,
        "pid": 280,
        "path": "/0/280/",
        "name": "出行必备",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/744b89806f0748a4bdddea199a782600fe84jrg2f4.jpg",
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 281,
    "pid": 0,
    "path": "/0/",
    "name": "户外出行",
    "type": 1,
    "url": "",
    "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/maintain/2021/12/25/55014ffb17b74d039b5670298e1047fcyw64lmyzlj.jpg",
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 288,
        "pid": 281,
        "path": "/0/281/",
        "name": "登山装备",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/c2cdf1e38ec34614b2baff0330191944g1zo5fmdnf.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 289,
        "pid": 281,
        "path": "/0/281/",
        "name": "露营装备",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/bec949aceb3e45999b19ac053f00d72aeclrba3gl4.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 290,
        "pid": 281,
        "path": "/0/281/",
        "name": "骑行配件",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/736886d587a343f5a9220b7a3d96dbf8osl5unhypg.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 757,
        "pid": 281,
        "path": "/0/281/",
        "name": "游泳设备",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/21b278d8783a4e1fa17ee1b92da50d92zpnv3onj9b.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 901,
        "pid": 281,
        "path": "/0/281/",
        "name": "瑜伽",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/6451e4fe565641ceae3548ddcce321e1kl4xfhpd7m.jpg",
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 282,
    "pid": 0,
    "path": "/0/",
    "name": "美妆个护",
    "type": 1,
    "url": "",
    "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/maintain/2021/12/25/2eef89b403dd47619e349e3edb057ce4g2clr5d4xn.jpg",
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 291,
        "pid": 282,
        "path": "/0/282/",
        "name": "清洁",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/7ae54933ee9b45c2bdd9d63ab01f908cng5arixnr0.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 292,
        "pid": 282,
        "path": "/0/282/",
        "name": "美容仪器",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/6ee967bfe1774677a61b562b603542a6rshho7yl13.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 293,
        "pid": 282,
        "path": "/0/282/",
        "name": "彩妆",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/64814c07048e4b928c1742eb60c439502h633y31o9.png",
        "status": true,
        "sort": 0
      },
      {
        "id": 294,
        "pid": 282,
        "path": "/0/282/",
        "name": "香水",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/59a800332a174d96ba485ededa208ff1rj3cgiyobx.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 295,
        "pid": 282,
        "path": "/0/282/",
        "name": "彩妆",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/44963a5f4ee74f68bf2dbefd63da43e7gjy10oactm.png",
        "status": true,
        "sort": 0
      },
      {
        "id": 296,
        "pid": 282,
        "path": "/0/282/",
        "name": "工具",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/2867c4bece834f59bcfc1cdf03a0967b82a641bssy.jpg",
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 283,
    "pid": 0,
    "path": "/0/",
    "name": "数码家电",
    "type": 1,
    "url": "",
    "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/maintain/2021/12/25/432cb941d4f64f4c88d2d3a8b784f282kqlp2cu55l.jpg",
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 297,
        "pid": 283,
        "path": "/0/283/",
        "name": "按摩仪",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/da12d8e62ed74354a0a745d45f4f6d20fevdfmje6m.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 298,
        "pid": 283,
        "path": "/0/283/",
        "name": "耳机",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/fc7955391cb1459ea2bb23749eadb839vgl1f766im.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 921,
        "pid": 283,
        "path": "/0/283/",
        "name": "游戏机",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/caa9d222b17e48dca197c9519150e4afy5buffmrqh.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 922,
        "pid": 283,
        "path": "/0/283/",
        "name": "音响",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/558eefb6109e4813b87f9bf22ee8f9846qdhe2h6ei.jpg",
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 284,
    "pid": 0,
    "path": "/0/283/",
    "name": "日用文创",
    "type": 1,
    "url": "",
    "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2021/12/25/d813cbdd98b148c99885652234ad43b1m1aewwn8wd.jpg",
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 300,
        "pid": 284,
        "path": "/0/283/284/",
        "name": "日用杂货",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2021/12/25/61bf8228d96b4c8c9343bc13b4e6fc67c0jmc2y781.png",
        "status": true,
        "sort": 0
      },
      {
        "id": 301,
        "pid": 284,
        "path": "/0/283/284/",
        "name": "纸品湿巾",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2021/12/25/ae2a9db4d74a4a56bddb971d3df9e60fljwxe9z3lh.png",
        "status": true,
        "sort": 0
      },
      {
        "id": 302,
        "pid": 284,
        "path": "/0/283/284/",
        "name": "办公文具",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2021/12/25/de35d545523448db9f3636e34ca085b29qw11rescg.png",
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 791,
    "pid": 0,
    "path": "/0/",
    "name": "书籍",
    "type": 1,
    "url": "",
    "extra": null,
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 795,
        "pid": 791,
        "path": "/0/791/",
        "name": "经管励志",
        "type": 1,
        "url": "",
        "extra": null,
        "status": false,
        "sort": 3
      },
      {
        "id": 794,
        "pid": 791,
        "path": "/0/791/",
        "name": "家庭教育",
        "type": 1,
        "url": "",
        "extra": null,
        "status": false,
        "sort": 2
      },
      {
        "id": 793,
        "pid": 791,
        "path": "/0/791/",
        "name": "小说文学",
        "type": 1,
        "url": "",
        "extra": null,
        "status": false,
        "sort": 1
      },
      {
        "id": 792,
        "pid": 791,
        "path": "/0/791/",
        "name": "绝版珍藏",
        "type": 1,
        "url": "",
        "extra": null,
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 890,
    "pid": 0,
    "path": "/0/",
    "name": "厨房电器",
    "type": 1,
    "url": "",
    "extra": null,
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 891,
        "pid": 890,
        "path": "/0/890/",
        "name": "炸锅",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/a8766bca90a54bfbbe9f5e190bae03e60005f3ej1h.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 923,
        "pid": 890,
        "path": "/0/890/",
        "name": "厨具",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/f8078630a20a4846a650c1ddc13d0ab1cspktsexyz.jpg",
        "status": true,
        "sort": 0
      },
      {
        "id": 924,
        "pid": 890,
        "path": "/0/890/",
        "name": "破壁机",
        "type": 1,
        "url": "",
        "extra": "https://crmebjavasingle.oss-cn-beijing.aliyuncs.com/crmebimage/public/store/2024/10/16/3304cc86ca0a4a9f96e84275f048e262uggxl0fn01.jpg",
        "status": true,
        "sort": 0
      }
    ]
  },
  {
    "id": 905,
    "pid": 0,
    "path": "/0/",
    "name": "坯布",
    "type": 1,
    "url": "",
    "extra": null,
    "status": true,
    "sort": 0,
    "child": [
      {
        "id": 906,
        "pid": 905,
        "path": "/0/905/",
        "name": "针织",
        "type": 1,
        "url": "",
        "extra": null,
        "status": false,
        "sort": 0
      },
      {
        "id": 907,
        "pid": 905,
        "path": "/0/905/",
        "name": "梭织",
        "type": 1,
        "url": "",
        "extra": null,
        "status": false,
        "sort": 0
      }
    ]
  }
];
export const MOCK_PRODUCT_ATTR = [
  {
    "id": 272,
    "ruleName": "大小粗细",
    "ruleValue": "[{\"value\":\"大小\",\"detail\":[\"小\",\"中\",\"大\"],\"inputVisible\":false},{\"value\":\"粗细\",\"detail\":[\"细\",\"中\",\"小\"],\"inputVisible\":false}]"
  },
  {
    "id": 271,
    "ruleName": "测试规格20241109",
    "ruleValue": "[{\"value\":\"Test_GG\",\"detail\":[\"ss\",\"bb\"],\"inputVisible\":false},{\"value\":\"Test_MM\",\"detail\":[\"ll\",\"tt\"],\"inputVisible\":false}]"
  },
  {
    "id": 270,
    "ruleName": "000",
    "ruleValue": "[{\"value\":\"00\",\"detail\":[\"00\",\"0000\"],\"inputVisible\":false}]"
  },
  {
    "id": 269,
    "ruleName": "test1",
    "ruleValue": "[{\"value\":\"1\",\"detail\":[\"11\",\"22\",\"33\"],\"inputVisible\":false}]"
  },
  {
    "id": 268,
    "ruleName": "55",
    "ruleValue": "[{\"value\":\"55\",\"detail\":[\"5\"]}]"
  },
  {
    "id": 267,
    "ruleName": "test111",
    "ruleValue": "[{\"value\":\"rrr\",\"detail\":[\"11\"]}]"
  },
  {
    "id": 266,
    "ruleName": "666666",
    "ruleValue": "[{\"value\":\"11\",\"detail\":[\"11\"]},{\"value\":\"22\",\"detail\":[\"22\"]}]"
  },
  {
    "id": 265,
    "ruleName": "yilin",
    "ruleValue": "[{\"value\":\"1\",\"detail\":[\"10\"]}]"
  },
  {
    "id": 264,
    "ruleName": "阿巴阿巴",
    "ruleValue": "[{\"value\":\"阿巴\",\"detail\":[\"20254\"]}]"
  },
  {
    "id": 263,
    "ruleName": "王大大",
    "ruleValue": "[{\"value\":\"打唔打\",\"detail\":[\"带娃大\"]}]"
  },
  {
    "id": 262,
    "ruleName": "qwer",
    "ruleValue": "[{\"value\":\"b\",\"detail\":[\"c\",\"d\",\"e\"],\"inputVisible\":false}]"
  },
  {
    "id": 261,
    "ruleName": "测试试试",
    "ruleValue": "[{\"value\":\"辣度\",\"detail\":[\"中等\",\"轻度\",\"重度\"],\"inputVisible\":false}]"
  },
  {
    "id": 260,
    "ruleName": "wed",
    "ruleValue": "[{\"value\":\"121212\",\"detail\":[\"1212112\"]}]"
  },
  {
    "id": 259,
    "ruleName": "期待",
    "ruleValue": "[{\"value\":\"颜色\",\"detail\":[\"红色\",\"黑色\",\"白色\"],\"inputVisible\":false},{\"value\":\"口味\",\"detail\":[\"甜\",\"辣\",\"微辣\"],\"inputVisible\":false}]"
  },
  {
    "id": 258,
    "ruleName": "111-=111",
    "ruleValue": "[{\"value\":\"11\",\"detail\":[\"11\"]}]"
  },
  {
    "id": 257,
    "ruleName": "外网",
    "ruleValue": "[{\"value\":\"1212\",\"detail\":[\"12\"]}]"
  },
  {
    "id": 256,
    "ruleName": "对的",
    "ruleValue": "[{\"value\":\"安按\",\"detail\":[\"对的\"]}]"
  },
  {
    "id": 255,
    "ruleName": "规格测出猜测",
    "ruleValue": "[{\"value\":\"234\",\"detail\":[\"243\"],\"inputVisible\":true}]"
  },
  {
    "id": 254,
    "ruleName": "规格哒哒哒",
    "ruleValue": "[{\"value\":\"颜色\",\"detail\":[\"红褐色\",\"黄色\"],\"inputVisible\":false},{\"value\":\"尺寸\",\"detail\":[\"cm\",\"qq\"],\"inputVisible\":false}]"
  },
  {
    "id": 253,
    "ruleName": "测试规格哒哒哒哒哒哒哒哒哒",
    "ruleValue": "[{\"value\":\"颜色\",\"detail\":[\"红褐色\",\"红色\"],\"inputVisible\":false}]"
  },
  {
    "id": 252,
    "ruleName": "1dfg",
    "ruleValue": "[{\"value\":\"2\",\"detail\":[\"3\"]}]"
  },
  {
    "id": 251,
    "ruleName": "dwad",
    "ruleValue": "[{\"value\":\"1\",\"detail\":[\"11\"]}]"
  },
  {
    "id": 250,
    "ruleName": "e",
    "ruleValue": "[{\"value\":\"e\",\"detail\":[\"e\"]}]"
  },
  {
    "id": 249,
    "ruleName": "ASFS",
    "ruleValue": "[{\"value\":\"213\",\"detail\":[\"124\"]},{\"value\":\"214\",\"detail\":[\"124\"]},{\"value\":\"124\",\"detail\":[\"142\"]}]"
  },
  {
    "id": 248,
    "ruleName": "测试规格2355235",
    "ruleValue": "[{\"value\":\"32\",\"detail\":[\"523\",\"236\",\"423\",\"35\",\"623\",\"5436\"],\"inputVisible\":false}]"
  },
  {
    "id": 247,
    "ruleName": "尺码",
    "ruleValue": "[{\"value\":\"尺码\",\"detail\":[\"S\",\"M\",\"L\"],\"inputVisible\":false}]"
  },
  {
    "id": 246,
    "ruleName": "fafa",
    "ruleValue": "[{\"value\":\"faf\",\"detail\":[\"22\"],\"inputVisible\":true}]"
  },
  {
    "id": 245,
    "ruleName": "鞋码",
    "ruleValue": "[{\"value\":\"标准鞋码\",\"detail\":[\"35\",\"36\",\"37\",\"38\",\"39\",\"40\"],\"inputVisible\":false}]"
  },
  {
    "id": 244,
    "ruleName": "上衣",
    "ruleValue": "[{\"value\":\"尺码\",\"detail\":[\"L\",\"XL\",\"XXL\",\"M\"],\"inputVisible\":false}]"
  },
  {
    "id": 243,
    "ruleName": "3",
    "ruleValue": "[{\"value\":\"3\",\"detail\":[\"3\"]}]"
  },
  {
    "id": 242,
    "ruleName": "1231223333",
    "ruleValue": "[{\"value\":\"1\",\"detail\":[\"1\"]}]"
  },
  {
    "id": 241,
    "ruleName": "fgfdg",
    "ruleValue": "[{\"value\":\"fgf\",\"detail\":[\"ff\"]},{\"value\":\"rrr\",\"detail\":[\"rrr\"]}]"
  },
  {
    "id": 240,
    "ruleName": "12131",
    "ruleValue": "[{\"value\":\"吊袜带\",\"detail\":[\"打唔打\"]}]"
  },
  {
    "id": 239,
    "ruleName": "规格1",
    "ruleValue": "[{\"value\":\"11\",\"detail\":[\"11\",\"22\"],\"inputVisible\":false}]"
  },
  {
    "id": 238,
    "ruleName": "123gg",
    "ruleValue": "[{\"value\":\"1\",\"detail\":[\"2\"]}]"
  },
  {
    "id": 237,
    "ruleName": "斤",
    "ruleValue": "[{\"value\":\"半斤 一斤\",\"detail\":[\"称重\"]}]"
  },
  {
    "id": 236,
    "ruleName": "份",
    "ruleValue": "[{\"value\":\"小份\",\"detail\":[\"10\",\"店里面\"],\"inputVisible\":false},{\"value\":\"中份\",\"detail\":[\"15\",\"外卖\"],\"inputVisible\":false},{\"value\":\"大份\",\"detail\":[\"20\",\"会员\"],\"inputVisible\":false}]"
  },
  {
    "id": 235,
    "ruleName": "465465",
    "ruleValue": "[{\"value\":\"54545\",\"detail\":[\"日7567\"]}]"
  },
  {
    "id": 234,
    "ruleName": "1142",
    "ruleValue": "[{\"value\":\"154\",\"detail\":[\"235\"]}]"
  },
  {
    "id": 233,
    "ruleName": "色也",
    "ruleValue": "[{\"value\":\"2\",\"detail\":[\"2\",\"无色\"],\"inputVisible\":false},{\"value\":\"3\",\"detail\":[\"423\"]}]"
  }
]
