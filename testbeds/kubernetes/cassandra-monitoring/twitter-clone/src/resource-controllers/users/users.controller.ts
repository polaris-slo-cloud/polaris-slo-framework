import { Express, Request, Response } from 'express';
import { User } from '../../model';
import { getCurrTimestampForDb } from '../../util/time';
import { ResourceControllerBase } from '../resource.controller.base'

const USERS_PREFIX = '/users';

const queries = {
    insertUser: 'INSERT INTO users (username, email, password, time_joined) VALUES (:username, :email, :password, :time_joined)',
};

export class UsersController extends ResourceControllerBase {

    protected registerEndpointsInternal(express: Express): void {
        express.put(USERS_PREFIX, (req, res) => this.createUser(req, res));
    }

    private createUser(req: Request, res: Response): void {
        const user: User = req.body;
        if (!user.email || !user.password || !user.username) {
            this.sendErrorResponse(res, 'Incomplete user object', { statusCode: 400 });
            return;
        }
        user.time_joined = getCurrTimestampForDb();

        this.cassandra.execute(queries.insertUser, user, { prepare: true })
            .then(() => this.sendJsonResponse(res, user))
            .catch(error => this.sendErrorResponse(res, error?.toString() || 'DB Error'));
    }

}
