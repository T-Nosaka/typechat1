'use server';

import { Jobs } from "@/app/models/jobs";
import { JobStatus } from "@/app/utils/constants";

/*
 * ジョブ状態確認
 */
export async function getJobStatus(jobid: string) {
    const jobinfo = Jobs.getInstance().get(jobid);
    if( jobinfo == undefined ) {
        return { success: false, status: JobStatus.Failed  };
    }
    return { success: true, status: jobinfo.status };
}

