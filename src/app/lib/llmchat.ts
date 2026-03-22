//
// npm install oci-sdk
//

'use server';

import * as fs from 'fs';
import * as genaiif from 'oci-generativeaiinference'
import { ConfigFileAuthenticationDetailsProvider } from 'oci-common'
import { ROLLTYPE } from '../utils/constants';
import { ociconfig } from './ociconfig';
import { getmime } from '../utils/utilbackend';

/*
 * Generic AI Chat
 */
export async function llmgenchat({
    talks,
    imagefiles=[],
    historys = undefined,
    llmmodel,
    maxtoken,
    temperature = 0.1
}: {
    talks: string[]
    imagefiles: string[]
    historys: genaiif.models.Message[] | undefined 
    llmmodel: string
    maxtoken: number
    temperature: number
}): Promise<string> {

    const DEFAULT_MODEL = llmmodel;
    const compatrmentId = process.env.OCI_COMPARTMENTID!;
    const MAX_TOKEN = maxtoken;

    //OCIコンフィグ
    const provider: ConfigFileAuthenticationDetailsProvider = ociconfig(process.env.OCI_CONFIG!);

    //Generative AI クライアントの初期化
    const client = new genaiif.GenerativeAiInferenceClient({
        authenticationDetailsProvider: provider
    });

    //メッセージ作成
    const contents = [];
    //文字列
    for (const talk of talks) {
        const txtcontent: genaiif.models.TextContent = {
            type: genaiif.models.TextContent.type,
            text: talk
        };
        contents.push(txtcontent);
    }
    //画像ファイル
    for (const imgfile of imagefiles) {
        const mimeType = await getmime(imgfile);
        const base64Image = fs.readFileSync(imgfile).toString('base64');
        const imgcontent: genaiif.models.ImageContent = {
            imageUrl: {
                url: `data:${mimeType};base64,${base64Image}`
            },
            type: "IMAGE"
        };
        contents.push(imgcontent);
    }

    const chat_messages = [];
    if (historys != undefined) {
        //履歴
        historys.forEach((msg) => {
            chat_messages.push(msg);
        });
    }
    const message: genaiif.models.Message = {
        role: ROLLTYPE.ROLE_USER,
        content: contents
    };
    chat_messages.push(message);

    const chat_request: genaiif.models.GenericChatRequest = {
        apiFormat: genaiif.models.GenericChatRequest.apiFormat,
        messages: chat_messages,
        maxTokens: MAX_TOKEN,
        temperature: temperature
    };

    const serving_mode: genaiif.models.OnDemandServingMode = {
        servingType: genaiif.models.OnDemandServingMode.servingType,
        modelId: DEFAULT_MODEL
    };

    const chat_details: genaiif.models.ChatDetails = {
        compartmentId: compatrmentId,
        servingMode: serving_mode,
        chatRequest: chat_request
    };

    const cr: genaiif.requests.ChatRequest = {
        chatDetails: chat_details
    };

    let talkresponce = "";
    const response: genaiif.responses.ChatResponse | ReadableStream<Uint8Array> | null = await client.chat(cr);
    if (response as genaiif.responses.ChatResponse) {
        const generic_response = (response as genaiif.responses.ChatResponse).chatResult.chatResponse as genaiif.models.GenericChatResponse;
        const chatchoice = generic_response.choices[0];
        const msg = chatchoice?.message;
        if (msg != null) {
            for (const cnt of msg.content as Array<genaiif.models.ChatContent>) {
                if (cnt as genaiif.models.TextContent) {
                    talkresponce += (cnt as genaiif.models.TextContent).text;
                }
            }
        }
    }

    return talkresponce;
}
