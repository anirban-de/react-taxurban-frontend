import { isDev } from "../config"

const root = isDev ? 'test' : 'live';

export const uploadFolders = {
    SRFiles: `${root}/SRFiles`,
    UserFiles: {
        branch: `${root}/UserFiles/branch`,
        customer: `${root}/UserFiles/customer`,
        admin: `${root}/UserFiles/admin`,
    }
}