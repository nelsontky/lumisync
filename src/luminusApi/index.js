const rp = require("request-promise");
const fs = require("fs");
const authorization = require("./authorization");

const allMods =
    "https://luminus.nus.edu.sg/v2/api/module/?populate=Creator%2CtermDetail%2CisMandatory";

// Use on module list
async function getList(bearer, id) {
    const options = {
        uri: `https://luminus.nus.edu.sg/v2/api/files/?populate=totalFileCount%2CsubFolderCount%2CTotalSize&ParentID=${id}`,
        auth: { bearer },
        method: "GET",
        json: true
    };

    return (await rp(options)).data.map(x => ({
        name: x.name,
        isFile: x.fileFormat === "File",
        id: x.id,
        lastUpdatedDate: x.lastUpdatedDate
    }));
}

async function enterFolder(id) {
    const options = {
        uri: `https://luminus.nus.edu.sg/v2/api/files/${id}/file?populate=Creator%2ClastUpdatedUser%2Ccomment`,
        auth: { bearer },
        method: "GET",
        json: true
    };

    return (await rp(options)).data.map(x => ({
        name: x.name,
        isFile: x.fileFormat === "File",
        id: x.id,
        lastUpdatedDate: x.lastUpdatedDate
    }));
}

async function download(bearer, moduleName, fileObj) {
    const options = {
        uri: fileObj.isFile
            ? `https://luminus.nus.edu.sg/v2/api/files/file/${fileObj.id}/downloadurl`
            : `https://luminus.nus.edu.sg/v2/api/files/${fileObj.id}/downloadurl`,
        auth: { bearer },
        method: "GET",
        json: true
    };

    try {
        const url = (await rp(options)).data;

        moduleName = moduleName.replace("/", " ");

        if (!fs.existsSync(moduleName)) {
            fs.mkdirSync(moduleName);
        }

        rp({ uri: url, auth: { bearer } }).pipe(
            fs.createWriteStream(
                `${moduleName}/${
                    fileObj.isFile ? fileObj.name : fileObj.name + ".zip"
                }`
            )
        );
    } catch (e) {
        console.log(`${moduleName}: "${fileObj.name}" folder is empty`);
    }
}

async function main() {
    const bearer = await authorization();
    console.log(bearer);

    const options = {
        uri: allMods,
        auth: { bearer },
        method: "GET",
        json: true
    };

    const res = await rp(options);
    const modules = res.data.map(x => ({ name: x.name, id: x.id }));

    modules.forEach(async module => {
        const contents = await getList(bearer, module.id);
        console.log(module.name);
        contents.forEach(async file => {
            download(bearer, module.name, file);
        });
        console.log("--------------------");
    });
}

main();
