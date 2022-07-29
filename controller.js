
const express = require('express');
const WebCam = require('./cam');
const stream = require('stream');
const fs = require('fs');

module.exports = (port) => {
    
    const app = express();
    const Cams = WebCam();

    const init = (app) => {
        app.get('/', (req, res) => {
            res.send({
                message : 'Cam API Up and Running'
            })
        })
        
        app.get('/cams', async (req, res) => {
            res.send(await Cams.getList(`${req.protocol}://${req.headers.host}`));
        })

        app.get('/capture/:dev', async (req, res) => {
            res.setHeader('content-type', 'image/jpg');
            const r = await Cams.getPitchureStream(req.params.dev);
            const ps = new stream.PassThrough();
            stream.pipeline(
            r,
            ps,
            (err) => {
                if (err) {
                    console.log(err) // No such file or any other kind of error
                    return res.status(400).send(err); 
                }
            })
            ps.pipe(res);
        })

        app.get('/clean', (req, res) => {
            fs.rmSync('images', {recursive: true, force: true });
            res.status(200).send({ message : 'Directory Cleanup is done'});
        })
    }

    init(app);

    app.listen(port, () => {
        console.log('Server is listening on ' + port);
    })
}