
export interface PageRoute {
  displayName: string;
  name: string;
  path: string;
  type: string;
  children?: SubPageRoute[];
}

export interface SubPageRoute {
  path: string;
  name: string;
  displayName: string;
}

export const PageRoutes = [
  {
    displayName: '首頁',
    name: 'Home',
    path: '/',
    type: 'page',
  },
  {
    displayName: 'Ig留言功能',
    name: 'Ig Lottery Tool',
    path: '/ig-lottery',
    type: 'page',
  },
  {
    displayName: '作品集',
    name: 'Collections',
    path: '/collections',
    type: 'page',
    children: [
      {
        path: 'react-hook-form-demo',
        name: 'React Hook Form Demo',
        displayName: 'React Hook Form Demo 範例',
      },
    ],
  },
];

