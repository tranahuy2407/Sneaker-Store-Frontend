import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Layers,
  CreditCard,
  Receipt,
  List,
  ChevronDown,
  ChevronRight,
  Tags,
  Star,
} from "lucide-react";
import logo from "../../assets/sneaker-logo.jfif";

const menu = [
  {
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/admin/dashboard",
  },
  {
    label: "QUẢN LÝ SẢN PHẨM",
    isGroup: true,
  },
  {
    label: "Sản Phẩm",
    icon: <Package className="w-5 h-5" />,
    href: "#",
    hasSubmenu: true,
    submenu: [
      {
        label: "Tất Cả Sản Phẩm",
        href: "/admin/products",
      },
      {
        label: "Thêm Sản Phẩm",
        href: "/admin/products/add",
      },
    ],
  },
  {
    label: "Quản Lý Kho",
    icon: <Layers className="w-5 h-5" />,
    href: "#",
    hasSubmenu: true,
    submenu: [
      {
        label: "Tổng Kho Sản Phẩm",
        href: "/admin/warehouse/inventory",
      },
      {
        label: "Lịch Sử Điều Chỉnh",
        href: "/admin/warehouse/history",
      },
    ],
  },
{
    label: "Quản Lý Giảm giá",
    icon: <Tags className="w-5 h-5" />,
    href: "#",
    hasSubmenu: true,
    submenu: [
      {
        label: "Chương trình giảm giá",
        href: "/admin/promotions",
      },
      {
        label: "Mã giảm giá",
        href: "/admin/coupons",
      },
    ],
  },
  {
    label: "Quản Lý Đánh Giá",
    icon: <Star className="w-5 h-5" />,
    href: "#",
    hasSubmenu: true,
    submenu: [
      {
        label: "Đánh giá sản phẩm",
        href: "/admin/products/reviews",
      },
      {
        label: "Đánh giá cửa hàng",
        href: "/admin/stores/reviews",
      },
    ],
  },
  {
    label: "QUẢN LÝ BÁN HÀNG",
    isGroup: true,
  },
  {
    label: "Đơn Hàng",
    icon: <ShoppingCart className="w-5 h-5" />,
    href: "/admin/orders",
  },
  {
    label: "Hóa Đơn",
    icon: <Receipt className="w-5 h-5" />,
    href: "/admin/invoices",
  },
  {
    label: "Thanh Toán",
    icon: <CreditCard className="w-5 h-5" />,
    href: "/admin/payment-methods",
  },
  {
    label: "Phí Vận Chuyển",
    icon: <Receipt className="w-5 h-5" />,
    href: "/admin/shipping-costs",
  },
  {
    label: "Khách Hàng",
    icon: <Users className="w-5 h-5" />,
    href: "/admin/customers",
  },
  {
    label: "THUỘC TÍNH SẢN PHẨM",
    isGroup: true,
  },
  {
    label: "Danh Mục",
    icon: <List className="w-5 h-5" />,
    href: "#",
    hasSubmenu: true,
    submenu: [
      {
        label: "Tất cả danh mục",
        href: "/admin/categories",
      },
      {
        label: "Thêm danh mục mới",
        href: "/admin/categories/add",
      },
    ],
  },
  {
    label: "Thương Hiệu",
    icon: <Tag className="w-5 h-5" />,
    href: "#",
    hasSubmenu: true,
    submenu: [
      {
        label: "Tất cả thương hiệu",
        href: "/admin/brands",
      },
      {
        label: "Thêm thương hiệu mới",
        href: "/admin/brands/add",
      },
    ],
  },
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState(new Set());

  const toggleSubmenu = (label) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedMenus(newExpanded);
  };

  useEffect(() => {
    const newExpanded = new Set(expandedMenus);
    menu.forEach((item) => {
      if (item.hasSubmenu && item.submenu) {
        const hasActiveSubmenu = item.submenu.some(
          (subItem) => location.pathname === subItem.href
        );
        if (hasActiveSubmenu) newExpanded.add(item.label);
      }
    });
    setExpandedMenus(newExpanded);
  }, [location.pathname]);

  const handleNavigation = (href) => {
    if (href !== "#") {
      navigate(href);
      setOpen(false);
    }
  };

  const handleToggleSubmenu = (label, hasSubmenu) => {
    if (hasSubmenu) {
      toggleSubmenu(label);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-gray-200 transition-transform duration-300 transform md:static md:flex-shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded" />
          <span className="text-lg font-bold text-gray-900">
            Sneaker<span className="text-yellow-500">Store</span>
          </span>
          <button
            className="p-2 ml-auto rounded md:hidden hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {menu.map((item, idx) =>
            item.isGroup ? (
              <div
                key={idx}
                className="mt-4 mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase"
              >
                {item.label}
              </div>
            ) : (
              <div key={idx}>
                <button
                  onClick={() =>
                    handleToggleSubmenu(item.label, item.hasSubmenu) ||
                    handleNavigation(item.href)
                  }
                  className={`flex w-full gap-2 items-center p-2 text-gray-700 rounded transition hover:bg-gray-100 ${
                    item.hasSubmenu ? "justify-between" : ""
                  } ${
                    !item.hasSubmenu && location.pathname === item.href
                      ? "bg-yellow-100 text-yellow-700"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.hasSubmenu && (
                    <div>
                      {expandedMenus.has(item.label) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </button>

                {item.hasSubmenu && expandedMenus.has(item.label) && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.submenu?.map((subItem, subIdx) => {
                      const isActive = location.pathname === subItem.href;
                      return (
                        <button
                          key={subIdx}
                          onClick={() => handleNavigation(subItem.href)}
                          className={`flex items-center w-full p-2 text-sm rounded transition hover:bg-gray-100 ${
                            isActive
                              ? "bg-yellow-100 text-yellow-700"
                              : "text-gray-600"
                          }`}
                        >
                          {isActive && (
                            <div className="w-2 h-2 mr-2 bg-yellow-500 rounded-full" />
                          )}
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
