import express from 'express';
import path from 'path';
import fs from "fs"; 
import axios from 'axios';
import * as dotenv from 'dotenv'
const app = express();
dotenv.config();

const PORT = process.env.APP_PORT;
const indexPath  = path.resolve(__dirname, '..', '/app/build', 'index.html');

// static resources should just be served as they are
app.use(express.static(
    path.resolve(__dirname, '..', '/app/build'),
    { maxAge: '30d' },
)); 

function toPascalCase(sentence: string | number | undefined) {
    if (typeof sentence === 'string')
      return sentence
        .split(' ')
        .map((word: string) =>
          word
            .split('')
            .map((character: string, index: number) =>
              index === 0 ? character.toUpperCase() : character.toLowerCase()
            )
            .join('')
        )
        .join(' ');
    else if (typeof sentence === 'number') {
      return sentence;
    }
    return undefined;
  }

// here we serve the index.html page
app.get('/*', (req, res, next) => {
    
    const pathname = req.url;
    const currentPage = pathname.split("/");
    const infoName = currentPage[1];
    const infoId = currentPage[3];
    const frontendUrl = process.env.APP_URL;
    if(infoName === 'stallions' || infoName === 'stud-farm') {
        const apiCallName = (infoName === 'stud-farm') ? 'farms' : infoName;
        const defaultImage = (infoName === 'stud-farm') ? process.env.DEFAULT_FARM_IMAGE : process.env.DEFAULT_HORSE_IMAGE;
        let dynamicOverviewData: any;
        let stallionOverview: any;
        let apiOverview: any;
        let farmOverview: any;
        axios.get( `${process.env.API_URL}/${apiCallName}/${infoId}`)
        .then(response => {
            fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
                if (err) {
                    console.error('Error during file reading', err);
                    return res.status(404).end()
                }

                // get stallion info & inject meta tags
                const apiResponse = response?.data;
                stallionOverview = farmOverview = apiResponse?.overview;
                if(apiResponse?.overview === null) {
                        apiOverview = await axios.get( `${process.env.API_URL}/${apiCallName}/${infoId}/overview`);
                        
                }
                dynamicOverviewData = apiOverview?.data;
                if(infoName === 'stud-farm') {
                    if (
                        dynamicOverviewData?.farmName &&
                        dynamicOverviewData?.farmState &&
                        dynamicOverviewData?.farmCountry &&
                        dynamicOverviewData?.StallionCount &&
                        dynamicOverviewData?.StallionList
                      ) {
                        farmOverview = `${toPascalCase(dynamicOverviewData?.farmName)} is a thoroughbred breeding farm located in ${toPascalCase(dynamicOverviewData?.farmState) + (dynamicOverviewData?.farmState && ',') + toPascalCase(dynamicOverviewData?.farmCountry)}. They currently stand ${dynamicOverviewData?.StallionCount} including ${toPascalCase(dynamicOverviewData?.StallionList)}.`;
                      }
                } else {
                    if (
                        dynamicOverviewData?.stallionName &&
                        dynamicOverviewData?.stallionAGE &&
                        apiResponse?.colourName &&
                        dynamicOverviewData?.farmName &&
                        dynamicOverviewData?.stallionCountryName &&
                        dynamicOverviewData?.stallionSireName &&
                        dynamicOverviewData?.stallionDamCOB &&
                        dynamicOverviewData?.stallionDamName
                      ) {                    
                        stallionOverview = `${toPascalCase(dynamicOverviewData?.stallionName)} is a ${dynamicOverviewData?.stallionAGE} year old ${apiResponse?.colourName} stallion currently standing at ${toPascalCase(dynamicOverviewData?.farmName)} in ${toPascalCase(dynamicOverviewData?.stallionCountryName)}. He is by${(dynamicOverviewData?.sireStatus) ? ' ' + dynamicOverviewData?.sireStatus : ""} ${toPascalCase(dynamicOverviewData?.stallionSireName)} and out of ${toPascalCase(dynamicOverviewData?.stallionDamCOB)} broodmare ${toPascalCase(dynamicOverviewData?.stallionDamName)}.`
                      }
                }
                toPascalCase(apiResponse?.farmName)?.toString()
                const metaTitle = (infoName === 'stud-farm') ? toPascalCase(apiResponse?.farmName)?.toString() : toPascalCase(apiResponse?.horseName)?.toString();
                const metaDesc = (infoName === 'stud-farm') ? farmOverview : stallionOverview;
                const metaImage = (infoName === 'stud-farm') ? ((apiResponse?.image === null) ? defaultImage : apiResponse?.image) : ((apiResponse?.profilePic === null && apiResponse?.galleryImage === null) ? defaultImage : ((apiResponse?.galleryImage === null) ? apiResponse?.profilePic : apiResponse?.galleryImage));
                const metaUrl = (infoName === 'stud-farm') ? frontendUrl + infoName + '/' + metaTitle + '/' + infoId : frontendUrl + infoName + '/' + metaTitle + '/' + infoId + '/View';
                htmlData = htmlData.replace(
                    `<title>${process.env.APP_TITLE}</title>`,
                    `<title>${metaTitle} ${process.env.APP_TITLE}</title>`
                )                
                .replace('__META_TITLE__', metaTitle)
                .replace('__META_DESCRIPTION__', metaDesc)
                .replace('__META_IMAGE__', metaImage)
                .replace('__META_URL__', metaUrl)
                .replace('__META_OG_TITLE__', metaTitle)
                .replace('__META_OG_DESCRIPTION__', metaDesc)
                .replace('__META_OG_IMAGE__', metaImage)
                .replace('__META_OG_URL__', metaUrl)
                return res.send(htmlData);
                
            });            
        })
        .catch(error => {
            console.log(error);
        });
    } else {
        fs.readFile(indexPath, 'utf8', (err, htmlData) => {
            if (err) {
                console.error('Error during file reading', err);
                return res.status(404).end()
            }
            htmlData = htmlData.replace(
                `<title>${process.env.APP_TITLE}</title>`,
                `<title>${process.env.APP_TITLE}</title>`
            )                
            .replace('__META_TITLE__', process.env.APP_TITLE)
            .replace('__META_DESCRIPTION__', process.env.APP_DESCRIPTION)
            .replace('__META_IMAGE__', process.env.DEFAULT_HORSE_IMAGE)
            .replace('__META_OG_TITLE__', process.env.APP_TITLE)
            .replace('__META_OG_DESCRIPTION__', process.env.APP_DESCRIPTION)
            .replace('__META_OG_IMAGE__', process.env.DEFAULT_HORSE_IMAGE)
            return res.send(htmlData);
        });
    }
});
// listening...
app.listen(PORT, (error: void) => {
    if (error !== null && error !== undefined) {
        return console.log('Error during app startup', error);
    }
    console.log("listening on " + PORT + "...");
});