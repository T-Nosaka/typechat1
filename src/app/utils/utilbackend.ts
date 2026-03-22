/*
 * npm install file-type
 */


'use server';

import * as fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';

/*
 * mime取得
 */
export async function getmime(imgfile:string) : Promise<string|undefined> {
    let resolve!: () => void;
    const resolveevent = new Promise<void>((res) => {
        resolve = res;
    });
    //MIME調査 先頭 4100 バイトのみ
    const buffer = Buffer.alloc(4100);
    var wmark=0;
    const readableStream = fs.createReadStream(imgfile, {
                    highWaterMark:buffer.length
                });
    readableStream.on("readable", () => {
        let chunk: Buffer | null;
        while ((chunk = readableStream.read()) !== null) {
            if(buffer.length<=wmark)
                return;
            var length = buffer.byteLength - wmark
            length = ( length<chunk.byteLength ) ? length:chunk.byteLength
            chunk.copy(buffer,0,wmark,length);
            wmark=wmark+length;
        }
    });
    readableStream.on("end", async () => {
        resolve();
    })
    await resolveevent;
    const result = await fileTypeFromBuffer(buffer.subarray(0, buffer.byteLength));
    return result?.mime;
}

