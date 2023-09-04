const { DateTime } = require("luxon");
import fs from "fs";
export const createTestFiles = () => {
    console.log("createTestFiles");

    const path = require("path");

    for (let i = 0; i < 30; i++) {
        const date = DateTime.fromJSDate(new Date()).minus({ days: i });
        const fileName = `backup-${date.toFormat("dd.MM.yyyy")}.tar.gz`;
        const filePath = path.join(__dirname, "..", "test", fileName);

        console.log(filePath);

        fs.open(filePath, "w", function (err, file) {
            if (err) throw err;
            console.log("Saved!");
        });

        if([10,15,19].includes(i)){
            fs.open(`${filePath.replace('backup-', 'backup-copy-')}`, "w", function (err, file) {
                if (err) throw err;
                console.log("Saved!");
            });
        }
    }
};


export const periodToSeconds = (input: string): number => {
    let p: any = input
           .replace('h', 'x3600')
           .replace('d', 'x86400')
           .replace('w', 'x604800')
           .replace('m', 'x2.628e+6')
           .replace('y', 'x3.154e+7').split('x')

    return (p[0] || 0) * (p[1] || 0);
  }