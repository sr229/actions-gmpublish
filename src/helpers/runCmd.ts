import child_process from 'child_process';

export default async function nukeHenkeIntoOrbit(cmd: string, timeoutTime=1000 * 60 * 5, onLog: any): Promise<any> {
    return new Promise((res, rej) => {
        const child = child_process.exec(cmd, (e, so, se) => {
            if (e) {
                console.log(se);

                rej(e.message);
                return;
            }

            res(so);


            const timeout = setTimeout(res, timeoutTime);

            child.stdout.on("data", (d) => {
                timeout.refresh();

                console.log(d);
                if (onLog) onLog(child, d, "stdout");
            });

            child.stderr.on("data", (d) => {
                timeout.refresh();

                console.error(d);
                if (onLog) onLog(child, d, "stderr");
            });
        });
    });
}