import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineAnnotation,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <HiOutlineViewGrid />
    },
    {
        key: 'Clients',
        label: 'Clientes',
        path: '/Clients',
        icon: <HiOutlineCube />
    },
    {
        key: 'users',
        label: 'Usuarios',
        path: '/users',
        icon: <HiOutlineShoppingCart />
    },
    {
        key: 'workers',
        label: 'Colaboradores',
        path: '/workers',
        icon: <HiOutlineUsers />
    },
    {
        key: 'billing',
        label: 'Facturación',
        path: '/billing',
        icon: <HiOutlineDocumentText />
    },
    {
        key: 'servicios',
        label: 'Servicios',
        path: '/servicios',
        icon: <HiOutlineAnnotation />
    }
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
    // {
    // 	key: 'settings',
    // 	label: 'Settings',
    // 	path: '/settings',
    // 	icon: <HiOutlineCog />
    // },
]
