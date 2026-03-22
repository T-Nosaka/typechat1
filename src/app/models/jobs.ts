
import { JobStatus } from '../utils/constants';

/*
 * ジョブ情報基底
 */
export abstract class JobInfo {
    // 一意識別
    id: string;

    //状況
    status: JobStatus = JobStatus.IDLE;

    //コンストラクタ
    constructor() {
        this.id = crypto.randomUUID();
    }

    //実行
    abstract run( cb: ()=>Promise<void> ) : Promise<void>;
};


/*
 * JOB管理
 */
export class Jobs {

    /*
     * シングルトン
     */
    public static getInstance(): Jobs {
        if (!jobssingleton) {
            jobssingleton = new Jobs();
        }
        return jobssingleton;
    }

    /*
     * JOBディクショナリ
     */ 
    private jobinfos = new Map<string, JobInfo>();

    /*
     * 取得
     */
    get( id: string ) :JobInfo | undefined{
        if ( this.jobinfos.has(id) ) {
            return this.jobinfos.get(id);
        }

        return undefined;
    }

    /*
     * セット
     */
    put( jobinfo:JobInfo ) {
        this.jobinfos.set( jobinfo.id, jobinfo );
    }

    /*
     * 削除
     */
    del(id: string) {
        if ( this.jobinfos.has(id) ) {
            this.jobinfos.delete(id);
        }
    }
}

/*
 * シングルトン
 */
let jobssingleton: Jobs | null = null;

