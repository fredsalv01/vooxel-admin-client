import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: <HiOutlineViewGrid />,
  },
  {
    key: 'workers',
    label: 'Colaboradores',
    path: '/workers',
    icon: <HiOutlineBriefcase />,
  },
  {
    key: 'Clients',
    label: 'Clientes',
    path: '/clients',
    icon: <HiOutlineUserGroup />,
  },
  {
    key: 'users',
    label: 'Usuarios',
    path: '/users',
    icon: <HiOutlineUsers />,
  },
  {
    key: 'billing',
    label: 'Facturación',
    path: '/billing',
    icon: <HiOutlineDocumentText />,
  },
  // {
  //   key: 'projects',
  //   label: 'Proyectos',
  //   path: '/projects',
  //   icon: <HiOutlineCollection />,
  // },
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  // {
  // 	key: 'settings',
  // 	label: 'Settings',
  // 	path: '/settings',
  // 	icon: <HiOutlineCog />
  // },
]
