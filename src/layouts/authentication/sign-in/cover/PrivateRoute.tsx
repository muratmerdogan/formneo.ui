import { Menu } from "api/generated";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMenuAuth } from "hooks/useMenuAuth";

const PrivateRoute: React.FC = () => {
  // Cache'lenmiş menü yetkilerini kullan
  const { data: menuAuth = [], isLoading } = useMenuAuth();

  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();
  const currentPath = location.pathname;

  // const normalizedPath = currentPath.replace(/\/[^/]+\/\d+$/, "/$1");
  const normalizedPath = "/" + currentPath.split("/").slice(1, 2).join("/");

  // /WorkCompany/1/Ticket/Create => /WorkCompany olarak al 2. / dan sonrasını sil

  const normalizeUrl = (url?: string | null) => {
    if (!url || typeof url !== "string") return "";
    return "/" + url.split("/").slice(1, 2).join("/");
  };

  // MenuHub sayfası /menu/:id için yetki kontrolü: üst seviye menüler yetki kapsamındadır
  const isMenuHub = normalizedPath === "/menu";
  const hasAccess = isMenuHub
    ? true
    : Array.isArray(menuAuth)
      ? menuAuth.some((permission) => {
        const href = (permission as any)?.href as string | undefined;
        if (!href) return false;
        return normalizeUrl(href) === normalizedPath;
      })
      : false;

  if (!accessToken) {
    return <Navigate to="/authentication/sign-in/cover" replace />;
  }

  if (isLoading) {
    return <div></div>; // Yüklenme mesajı
  }

  if (!hasAccess) {
    if (normalizedPath == "/authentication" || normalizedPath == "/dashboards" || isMenuHub) {
      return <Outlet />;
    }
    return <Navigate to="/NotAuthorization" replace />; // Yetkisi olmayanları yönlendir
  }

  return <Outlet />;
};

export default PrivateRoute;
