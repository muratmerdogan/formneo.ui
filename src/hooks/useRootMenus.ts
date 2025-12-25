import { useQuery } from "react-query";
import { MenuApi, MenuListDto } from "api/generated";
import getConfiguration from "confiuration";

/**
 * Ana menüleri merkezi olarak cache'leyen hook
 * Tüm component'ler bu hook'u kullanarak aynı cache'i paylaşır
 * Böylece RootMenus endpoint'i sadece bir kez çağrılır
 */
export const useRootMenus = () => {
  const fetchRootMenus = async (): Promise<MenuListDto[]> => {
    const conf = getConfiguration();
    const api = new MenuApi(conf);
    const result = await api.apiMenuRootMenusGet();
    return result.data || [];
  };

  return useQuery<MenuListDto[], Error>("rootMenus", fetchRootMenus, {
    staleTime: 1000 * 60 * 5, // 5 dakika boyunca veriyi taze tut
    cacheTime: 1000 * 60 * 10, // 10 dakika boyunca önbellekte tut
    refetchOnWindowFocus: false, // Pencere odaklandığında yeniden çekme
    refetchOnMount: false, // Component mount olduğunda cache'den kullan
    retry: 1, // Hata durumunda 1 kez tekrar dene
  });
};

