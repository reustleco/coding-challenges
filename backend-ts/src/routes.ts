import {Request, Response} from "express";

var model = require('./models/index');

export class Routes {

    public routes(app): void {
        // TODO:
        // * Implement the missing endpoints
        app.route('/contacts')
            .get((req: Request, res: Response) => {
                model.Contact.findAll({})
                    .then(users => res.json({
                        error: false,
                        data: users
                    }))
                    .catch(error => res.json({
                        error: true,
                        data: [],
                        error_message: error.message
                    }));
            });

        app.route('/users')
            .get((req: Request, res: Response) => {
                model.User.findAll({})
                    .then(users => res.json({
                        error: false,
                        data: users
                    }))
                    .catch(error => res.json({
                        error: true,
                        data: [],
                        error_message: error.message
                    }));
            });


    }
}