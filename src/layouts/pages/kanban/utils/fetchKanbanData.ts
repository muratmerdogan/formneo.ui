import { KanbanApi, KanbanTasksListDto } from "api/generated";
import getConfiguration from "confiuration";

export interface KanbanTasksListDtoFixed  {
    Id: string;
    Priority: string;
    RankId: string;
    Status: string;
    Summary: string;
    Tags: string;
    Type: string;
    Description: string;
    Assignee: string;
    AssigneeId: string;
}

const fetchKanbanDataForAll = async (): Promise<KanbanTasksListDtoFixed[]> => {
    try{
        let config = getConfiguration();
        let api = new KanbanApi(config);
        let response = await api.apiKanbanGet();
        let fixedData = response.data.map((item : KanbanTasksListDto) => {
            return {
                Id: item.id,
                Assignee: item.assignee.firstName + ' ' + item.assignee.lastName,
                AssigneeId: item.assignee.id,
                RankId: item.rankId,
                Priority: item.priority,
                Status: item.status,
                Tags: item.tags,
                Type: item.type,
                Description: item.description,
                Summary: item.summary,

            }
        })
        return fixedData;
    }catch(error){
        console.error('Error fetching kanban data:', error);
        throw error;
    }
}

// const fetchKanbanDataOnlySelf = async (userId: string): Promise<KanbanTasksListDtoFixed[]> => {
//     try{
//         let config = getConfiguration();
//         let api = new KanbanApi(config);
//         let response = await api.apiKanbanIdGet(userId);
//         // let fixedData = response.data.map((item : KanbanTasksListDto) => {
//         //     return {
//         //         Id: item.id,
//         //         Assignee: item.assignee.firstName + ' ' + item.assignee.lastName,
//         //         AssigneeId: item.assignee.id,
//         //         RankId: item.rankId,
//         //         Priority: item.priority,
//         //         Status: item.status,
//         //         Tags: item.tags,
//         //         Type: item.type,
//         //         Description: item.description,
//         //         Summary: item.summary,
//         //     }
//         // })
//         // return fixedData;
//     }catch(error){
//         console.error('Error fetching kanban data:', error);
//         throw error;
//     }
// }

export default fetchKanbanDataForAll;