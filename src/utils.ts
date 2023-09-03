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
