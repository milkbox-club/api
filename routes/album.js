module.exports = function (app) {
    app.get('/getAlbum', (req, res) => {
        var { application_id, artist, album } = req.query;
        if (app.locals.validApplicationId(application_id)) {
            artist = app.locals.strToKey(artist);
            album  = app.locals.strToKey(album);
            var log_data = [`aid=${application_id}`, `artist=${artist}`, `album=${album}`];
            if (artist in app.locals.album_data) {
                if (album in app.locals.album_data[artist].albums) {
                    res.status(200).send(app.locals.album_data[artist].albums[album]);
                } else {
                    // Missing album
                    log_data.push('comment="missing album"')
                    app.locals.writeUncategorizedData(log_data);
                    res.status(204).send();
                }
            } else {
                // Missing artist & album
                log_data.push('comment="missing artist & album"')
                app.locals.writeUncategorizedData(log_data);
                res.status(204).send();
            }
        } else {
            // Invalid application_id
            res.status(401).send();
        }
    });

    app.get('/setAlbum', (req, res) => {
        var { application_id, artist, album, year, genres } = req.query;
        if (app.locals.isAdmin(application_id)) {
            app.locals.createAlbum(artist, album, year, genres.split(','));
            app.locals.incrementContributionCount(application_id);
            res.status(200).send('Submitted!');
        } else {
            // Invalid role
            res.status(401).send();
        }
    });

    app.get('/getAlbums', (req, res) => {
        var { application_id } = req.query;
        if (app.locals.isAdmin(application_id)) {
            res.status(200).send(app.locals.album_data);
        } else {
            // Invalid role
            res.status(401).send();
        }
    });
}