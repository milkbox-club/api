module.exports = function (app) {
    app.get('/setPlaying', (req, res) => {
        const { application_id, artist, track, album, collection, paused } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            player_data = {
                artist: artist,
                track: track,
                album: album,
                collection: collection,
                paused: (paused == undefined) ? true : (paused == 'true')
            }
            app.locals.application_data[application_id].player = player_data;
            app.locals.writeApplicationData();
            res.status(200).send('Submitted!');
        } else {
            res.status(401).send();
        }
    });
    
    app.get('/getPlaying', (req, res) => {
        const { application_id } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            res.status(200).send(app.locals.application_data[application_id].player)
        } else {
            res.status(401).send();
        }
    });

    app.get('/setPaused', (req, res) => {
        const { application_id, status } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            switch(status) {
                case 'true':
                    app.locals.application_data[application_id].player.paused = true;
                    break;
                case 'false':
                    app.locals.application_data[application_id].player.paused = false;
                    break;
                default:
                    app.locals.application_data[application_id].player.paused = (
                        !app.locals.application_data[application_id].player.paused
                    );
                }
            app.locals.writeApplicationData();
            res.status(200).send('Submitted!')
        } else {
            res.status(401).send();
        }
    });
}