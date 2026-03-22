'use server';

import { Jobs } from "@/app/models/jobs";
import { LLMJobInfo } from "@/app/models/llmjobinfo";
import { Message } from "@/app/models/message";
import { JobStatus } from "@/app/utils/constants";


/*
 * LLMチャット要求
 */
export async function reqllmchat( talkmsg: string, messages:Message[] ) {

    console.log("reqllmchat");

    // ジョブ開始
    const jobinfo = new LLMJobInfo();
    jobinfo.talkmsg = talkmsg;
    jobinfo.messages = messages;

    Jobs.getInstance().put(jobinfo);

    jobinfo.run( () => {} );

    return { success: true, message: "ジョブ開始", jobid: jobinfo.id };    
}

/*
 * LLM結果取得
 */
export async function resultllm(jobid: string) {
    const jobinfo = Jobs.getInstance().get(jobid) as LLMJobInfo;
    if( jobinfo == undefined ) {
        return { success: false, status: JobStatus.Failed  };
    }

    Jobs.getInstance().del(jobid);
    
    return { success: true, message: "完了", status: jobinfo.status, llmresult: jobinfo.llmresult};    
}
