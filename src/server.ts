import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Enabled CORS
  app.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  // Filter Image
  app.get( "/filteredimage", async ( req, res, next ) => {
    let { image_url } = req.query;

    // Validate image_url
    if (!image_url) {
      return res.status(400).send("Invalid image url");
    }

    let localImagePath = await filterImageFromURL(image_url);

    res.status(200).sendFile(localImagePath, (err) => {
      if (err) {
        console.log(err);
      }
      // Clean up space occupied by image once, the image is sent
      deleteLocalFiles([localImagePath]);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();