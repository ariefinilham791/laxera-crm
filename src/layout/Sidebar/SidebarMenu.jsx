import * as Icons from 'tabler-icons-react';
import HkBadge from '@/components/@hk-badge/@hk-badge';

export const SidebarMenu = [
    {
        group: '',
        contents: [
            {
                name: 'Dashboard',
                icon: <Icons.Template />,
                path: '/crm',
                badge: <HkBadge size="sm" bg="pink" soft className="ms-auto" >hot</HkBadge>
            },
        ]
    },
    {
        group: 'CRM',
        contents: [
            {
                name: 'Penawaran',
                icon: <Icons.FileText />,
                path: '/crm/penawaran',
            },
            {
                name: 'Purchase Order',
                icon: <Icons.Receipt />,
                path: '/crm/po',
            },
            {
                name: 'Customers Management',
                icon: <Icons.Users />,
                path: '/crm/customers',
            },
            {
                name: 'Produk',
                icon: <Icons.Package />,
                path: '/crm/produk',
            },
            {
                name: 'Sales',
                icon: <Icons.UserCheck />,
                path: '/crm/sales',
            },
        ]
    },

    // Menghapus grup Pages dan Documentation sesuai permintaan

]
