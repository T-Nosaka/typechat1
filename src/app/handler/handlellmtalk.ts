'use client';

import { getJobStatus } from "../api/jobs/actions";
import { reqllmchat, resultllm } from "../api/llmtalk/actions";
import { Message } from "../models/message";
import { JobStatus } from "../utils/constants";

/*
 * LLMトーク
 */
export function handleLLMTalk(
    usercallback?: ( talkmsg:string ) => void,
    callback?: (contents:string) => void ) {
  return async ( talkmsg: string, messages:Message[] ) => {
    try {
        usercallback?.(talkmsg);

        const res = await reqllmchat( talkmsg, messages );
        if( res.success == true ) {
            //処理中の進捗を確認
            startPolling(res.jobid!,callback);
        }
    } catch (error) {
        console.error(error);
    } finally {
    }
  };
}

/*
 * 処理中
 */
const startPolling = (jobid: string, callback?: (contents:string) => void ) => {

    var llmresult = "";

    //間隔 ポーリング
    const interval = setInterval(async () => {

        const finishcall = ( ) => {
            clearInterval(interval);
            callback?.(llmresult);
        }

        console.log(`polling:${jobid}`);

        //状況監視
        const stsres = await getJobStatus(jobid);
        if ( stsres.success == true ) {

            switch(stsres.status) {
                case JobStatus.llmed :
                {
                    //結果発表
                    const res = await resultllm(jobid);
                    if( res.success == false ) {
                        finishcall();
                    } else {
                        llmresult = res.llmresult!
                    }
                }
                    break;                    
            }

            if (stsres.status == JobStatus.llmed || stsres.status == JobStatus.Failed ) {
                finishcall();
                return;
            }
        }

        //TODO: タイムアウトが必要だろう
    }
    ,1000);
}

