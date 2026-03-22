import * as genaiif from 'oci-generativeaiinference'

import { llmgenchat } from "../lib/llmchat";
import { JobStatus, } from "../utils/constants";
import { JobInfo } from "./jobs";
import { Message } from "./message";

/*
 * LLMJOB情報
 */
export class LLMJobInfo extends JobInfo {

    talkmsg: string = "";

    // チャット履歴
    messages: Message[] = [];

    //結果
    llmresult: string | undefined = undefined;

    //実行
    async run(cb: () => void): Promise<void> {
        try {

            await cb();

            await this.reqllmchat();

        } catch (err) {
            console.log(`ReportJobInfo: exception ${err}`);

            this.status = JobStatus.Failed;
        } finally {
            this.clean();
        }
    }

    /*
     * LLM要求
     */
    async reqllmchat(llmmodel: string = process.env.LLM_MODEL!, maxtoken: number = process.env.LLM_MAXTOKEN ? parseInt(process.env.LLM_MAXTOKEN) : 4000, temperature: number = 1.0) {
        this.status = JobStatus.llming

        const historys: genaiif.models.Message[] = [];
        for (const msg of this.messages) {

            const contents = [];

            const txtcontent: genaiif.models.TextContent = {
                type: genaiif.models.TextContent.type,
                text: msg.content
            };
            contents.push(txtcontent);

            const genmessage: genaiif.models.Message = {
                role: msg.role,
                content: contents
            };

            historys.push(genmessage);
        }

        const talkmsgs: string[] = [this.talkmsg];

        this.llmresult = await llmgenchat({
            talks: talkmsgs,
            imagefiles: [],
            historys: historys,
            llmmodel: llmmodel,
            maxtoken: maxtoken,
            temperature: temperature
        });

        this.status = JobStatus.llmed
    }

    /*
     * ごみ掃除
     */
    async clean() {
    }
}
