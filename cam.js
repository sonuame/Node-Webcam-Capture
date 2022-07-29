const NodeWebcam = require("node-webcam");
const uuid = require('uuid');
const fs = require('fs');

module.exports = () => {
    const opts = {
        width: 1280,
        height: 720,
        quality: 100,
        frames: 60,
        delay: 0,
        saveShots: true,
        output: "jpeg",
        device: false,
        callbackReturn: "location",
        verbose: false
    };

    const CamProvider = NodeWebcam.create(this.opts);

    const getList = async (req_url) => {
        return new Promise((resolve, reject) => {
            const cams = [];
            CamProvider.list(list => {
                list.forEach(c => {
                    let cam = NodeWebcam.create({ 
                        ...this.opts, 
                        device: c, 
                        verbose: true, 
                        title: true, 
                        subtitle: true,
                        link : `${req_url}/capture/${c}`
                    });
                    cams.push(cam);
                })
                resolve(cams);
            })
        })
    }

    const getPitchure = async (dev) => {
        return new Promise((resolve, reject) => {
            let cam = NodeWebcam.create({ ...opts, device: dev, verbose: true });
            fs.mkdirSync('images', { recursive: true });
            let filename = `images/image-from-cam-${dev}-${uuid.v4()}`;
            cam.capture(filename, (err, data) => {
                if(err) reject(err)
                else{
                    resolve(filename + ".jpg");
                }
            });
        })
    }

    const getPitchureStream = async (dev) => {
        return new Promise((resolve, reject) => {
            let cam = NodeWebcam.create({ ...opts, device: dev, verbose: true });
            fs.mkdirSync('images', { recursive: true });
            let filename = `images/image-from-cam-${dev}-${uuid.v4()}`;
            cam.capture(filename, (err, data) => {
                if(err) reject(err)
                else{
                    resolve(fs.createReadStream(filename + ".jpg"));
                }
            });
        })
    }

    return { getList, getPitchure, getPitchureStream }
}