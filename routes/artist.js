module.exports = function (app) {
    exports.get = function (req, res) {
        var { application_id, artist } = req.query;
        if ((application_id != undefined) && (application_id in app.locals.user_data)) {
            artist = strToKey(artist);
            var log_data = [`aid=${application_id}`, `artist=${artist}`];
            if (artist in app.locals.album_data) {
                res.status(200).send(app.locals.album_data[artist]);
            } else {
                // Missing artist
                writeUncategorizedData(log_data);
                res.status(204).send();
            }
        } else {
            // Invalid application_id
            res.status(401).send();
        }
    };
}