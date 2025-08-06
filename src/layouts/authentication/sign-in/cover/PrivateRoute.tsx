import { Menu, RoleMenuApi } from "api/generated";
import getConfiguration from "confiuration";
import { useQuery } from "react-query";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const [menuAuth, setmenuAuth] = useState<Menu[]>([]);
  const fetchRoleMenuPermissions = async () => {
    var conf = getConfiguration();
    var api = new RoleMenuApi(conf);
    var result = await api.apiRoleMenuGetAuthByUserGet();

    setmenuAuth(result.data);
    return result.data;
  };

  const useRoleMenuPermissions = () => {
    return useQuery("roleMenuPermissions", fetchRoleMenuPermissions, {
      staleTime: 1000 * 60 * 5, // 5 dakika boyunca veriyi taze tut
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false, // 10 dakika boyunca önbellekte tut
      enabled: true,
    });
  };

  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();
  const currentPath = location.pathname;

  // const normalizedPath = currentPath.replace(/\/[^/]+\/\d+$/, "/$1");
  const normalizedPath = "/" + currentPath.split("/").slice(1, 2).join("/");

  // /WorkCompany/1/Ticket/Create => /WorkCompany olarak al 2. / dan sonrasını sil

  const { data: permissions = [], isLoading, error } = useRoleMenuPermissions();

  const normalizeUrl = (url: string) => "/" + url.split("/").slice(1, 2).join("/");

  const hasAccess = menuAuth!.some(
    (permission) => normalizeUrl(permission.href) === normalizedPath
  );



  

  if (!accessToken) {
    return <Navigate to="/authentication/sign-in/cover" replace />;
  }

  if (isLoading) {
    return <div></div>; // Yüklenme mesajı
  }

  if (!hasAccess) {
    if(normalizedPath == "/tickets"){
      return <Outlet />
    }
    return <Navigate to="/NotAuthorization" replace />; // Yetkisi olmayanları yönlendir
  }

  return <Outlet />;
};

export default PrivateRoute;
