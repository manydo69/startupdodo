/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'LandingHome',
        title: 'Trang chủ',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home'
    },
    {
        id: 'Docsach',
        title: 'Đọc sách',
        type: 'basic',
        icon: 'heroicons_outline:book-open',
        link: '/sach'
    },
    {
        id: 'Baiviet',
        title: 'Bài viết',
        type: 'basic',
        icon: 'heroicons_outline:newspaper',
        link: '/baiviet'
    }
];
// export const compactNavigation: FuseNavigationItem[] = [
//     {
//         id   : 'example',
//         title: 'Example',
//         type : 'basic',
//         icon : 'heroicons_outline:chart-pie',
//         link : '/example'
//     }
// ];
export const compactNavigationByRoleQuanLy: FuseNavigationItem[] = [
    {
        id: 'Dashboard',
        title: 'Thống kê',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/admin/dashboard'
    },
    {
        id: 'QuanLybaocao',
        title: 'Giao dịch',
        type: 'basic',
        icon: 'heroicons_outline:trending-up',
        link: '/admin/quanlygiaodich'
    },
    {
        id: 'QuanLySach',
        title: 'QL sách',
        type: 'group',
        icon: 'heroicons_outline:view-boards',
        children: [
            {
                id: 'Sach',
                title: 'Sách',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: '/admin/quanlysach/sach'
            },
            {
                id: 'QuanLyChude',
                title: 'Chủ đề',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/admin/quanlysach/chude'
            },
        ]
    },
    {
        id: 'QuanLyBaiViet',
        title: 'QL bài viết',
        type: 'group',
        icon: 'heroicons_outline:clipboard-check',
        children: [
            {
                id: 'QlyBaiviet',
                title: 'Bài viết',
                type: 'basic',
                icon: 'heroicons_outline:newspaper',
                link: '/admin/quanlybaiviet'
            },
        ]
    },
    {
        id: 'QuanLybaocao',
        title: 'QL báo cáo',
        type: 'group',
        icon: 'heroicons_outline:pencil-alt',
        children: [
            {
                id: 'Danhmuc',
                title: 'Danh mục báo cáo',
                type: 'basic',
                icon: 'heroicons_outline:document-text',
                link: '/admin/quanlybaocao/danhmuc'
            },
            {
                id: 'Baocao',
                title: 'Báo cáo sách',
                type: 'basic',
                icon: 'heroicons_outline:flag',
                link: '/admin/quanlybaocao/baocao/sach',
            },
            {
                id: 'BaocaoBV',
                title: 'Báo cáo bài viết',
                type: 'basic',
                icon: 'heroicons_outline:flag',
                link: '/admin/quanlybaocao/baocao/baiviet',
            },
        ]
    },
    {
        id: 'QuanLybaocao',
        title: 'QL người dùng',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        children: [
            {
                id: 'NguoiDung',
                title: 'Người dùng',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/admin/quanlynguoidung',
            },
        ]
    },

];
export const compactNavigationByRoleAuthor: FuseNavigationItem[] = [
    {
        id: 'QuanLySachAuthor',
        title: 'QL sách',
        type: 'group',
        icon: 'heroicons_outline:chart-square-bar',
        children: [
            {
                id: 'QuanlysachAuthor',
                title: 'Sách đăng tải',
                type: 'basic',
                icon: 'heroicons_outline:view-boards',
                link: '/author/quanlysach/sach'
            }
        ]
    }
]
export const compactNavigationByRoleReader: FuseNavigationItem[] = [
    {
        id: 'NDluu',
        title: 'ND lưu',
        type: 'group',
        icon: 'heroicons_outline:bookmark',
        children: [
            {
                id: 'SachLuu',
                title: 'Sách lưu',
                type: 'basic',
                icon: 'heroicons_outline:bookmark',
                link: '/sach/saving'
            },
            {
                id: 'BaiVietLuu',
                title: 'Bài viết lưu',
                type: 'basic',
                icon: 'heroicons_outline:bookmark',
                link: '/baiviet/saving'
            },
        ]
    },
    {
        id: 'QuanlyTaichinh',
        title: 'QL tài chính',
        type: 'group',
        icon: 'heroicons_outline:library',
        children: [
            {
                id: 'Naptien',
                title: 'Nạp coin',
                type: 'basic',
                icon: 'heroicons_outline:currency-dollar',
                link: '/taichinh'
            },
            {
                id: 'Lichsugiaodich',
                title: 'Lịch sử giao dịch',
                type: 'basic',
                icon: 'heroicons_outline:clock',
                link: '/taichinh/lichsu'
            },
        ]
    },
]
