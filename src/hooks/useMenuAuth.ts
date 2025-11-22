import { useQuery } from "react-query";
import { MenuApi } from "api/generated";
import getConfiguration from "confiuration";
import { Menu } from "api/generated";

/**
 * Menü yetkilerini merkezi olarak cache'leyen hook
 * Tüm component'ler bu hook'u kullanarak aynı cache'i paylaşır
 * 
 * Not: Backend'de cache varsa, frontend cache süresi kısa tutulur
 * Sadece gereksiz tekrar çağrıları önlemek için kullanılır
 */
export const useMenuAuth = () => {
  const fetchMenuAuth = async (): Promise<Menu[]> => {
    const conf = getConfiguration();
    const api = new MenuApi(conf);
    const result = await api.apiMenuGetAuthByUserGet();
    return result.data || [];
  };

  return useQuery<Menu[], Error>("menuAuth", fetchMenuAuth, {
    staleTime: 1000 * 30, // 30 saniye boyunca veriyi taze tut
    cacheTime: 1000 * 60, // 1 dakika boyunca önbellekte tut
    refetchOnWindowFocus: false, // Pencere odaklandığında yeniden çekme
    refetchOnMount: false, // Component mount olduğunda cache'den kullan
    retry: 1, // Hata durumunda 1 kez tekrar dene
  });
};

