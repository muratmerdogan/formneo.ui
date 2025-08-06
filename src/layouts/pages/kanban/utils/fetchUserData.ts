import { UserApi, UserAppDtoWithoutPhoto } from "api/generated";
import getConfiguration from "confiuration";


const fetchUserData = async (): Promise<UserAppDtoWithoutPhoto[]> => {
    try {
        let config = getConfiguration();
        let api = new UserApi(config);
        let response = await api.apiUserVesaUsersWithoutPhotoGet();
       

        return response.data;

    } catch (error) {
        console.log(error);
        return [];
    }
}

export default fetchUserData;