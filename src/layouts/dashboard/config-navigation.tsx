import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      {
        subheader: 'Thống KÊ',
        items: [
          {
            title: t('app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: t('ecommerce'),
            path: paths.dashboard.general.ecommerce,
            icon: ICONS.ecommerce,
          },
          {
            title: t('analytics'),
            path: paths.dashboard.general.analytics,
            icon: ICONS.analytics,
          },
          {
            title: t('banking'),
            path: paths.dashboard.general.banking,
            icon: ICONS.banking,
          },
          {
            title: t('booking'),
            path: paths.dashboard.general.booking,
            icon: ICONS.booking,
          },
          {
            title: t('file'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'Quản Lý',
        items: [
          // PRODUCT
          {
            title: 'Sản Phẩm',
            path: paths.dashboard.product.root,
            icon: ICONS.product,
            children: [{ title: 'Danh sách', path: paths.dashboard.product.root }],
          },
          // LINH KIEN
          {
            title: 'Quản lý linh kiện',
            path: paths.dashboard.linhKien.root,
            icon: ICONS.product,
            children: [
              { title: 'Linh kiện', path: paths.dashboard.linhKien.linhKien },
              { title: 'Giao dịch', path: paths.dashboard.linhKien.transaction },
            ],
          },
          // ORDER
          {
            title: 'Đơn Hàng',
            path: paths.dashboard.order.root,
            icon: ICONS.order,
            children: [
              { title: 'Danh sách', path: paths.dashboard.order.root },
              {
                title: 'Tạo mới',
                path: paths.dashboard.order.new,
              },
            ],
          },

          // CUSTOMER
          {
            title: 'Khách hàng',
            path: paths.dashboard.customer.root,
            icon: ICONS.product,
            children: [{ title: 'Danh sách', path: paths.dashboard.customer.root }],
          },

          // USER
          {
            title: 'Người dùng',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [{ title: 'Danh sách', path: paths.dashboard.user.list }],
          },
          // STAFF
          {
            title: 'Nhân viên',
            path: paths.dashboard.staff.root,
            icon: ICONS.user,
            children: [{ title: 'Danh sách', path: paths.dashboard.staff.root }],
          },
          // KANBAN
          {
            title: 'Công việc',
            path: paths.dashboard.kanban,
            icon: ICONS.kanban,
          },
          {
            title: 'Lịch ghi chú',
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
          },
        ],
      },
      {
        subheader: 'CÀI ĐẶT',
        items: [
          {
            title: 'Category',
            path: paths.dashboard.category.root,
            icon: ICONS.product,
            children: [{ title: 'Danh sách', path: paths.dashboard.category.root }],
          },
          {
            title: 'Category sản phẩm',
            path: paths.dashboard.subCategory.root,
            icon: ICONS.product,
            children: [{ title: 'Danh sách', path: paths.dashboard.subCategory.root }],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
