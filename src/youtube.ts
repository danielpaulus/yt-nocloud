import ytdl from 'ytdl-core';
import * as fs from 'fs';

export const download = async(updater: ProgressUpdateFunc, url:string) =>  {


    ytdl.getInfo(url).then(info => {
      console.log('title:', info.videoDetails.title);
      console.log('rating:', info.player_response.videoDetails.averageRating);
      console.log('uploaded by:', info.videoDetails.author.name);
      console.log(JSON.stringify(info.videoDetails, null, 2));
  
      const video = ytdl(url);
      
      let starttime:number;
      video.pipe(fs.createWriteStream(`public/media/${info.videoDetails.videoId}.webm`));
      
      video.once('response', () => {
        starttime = Date.now();
      });
      
      video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
        updater(0,100,percent*100);

        const videoInfo = {
          title: info.videoDetails.title,
          uploadedBy: info.videoDetails.author.name,
          id:info.videoDetails.videoId
        }
        fs.writeFileSync(`public/media/${info.videoDetails.videoId}.json`, JSON.stringify(videoInfo));
        
      });
      video.on('end', () => {
        process.stdout.write('\n\n');
      });
  
    });
  

}