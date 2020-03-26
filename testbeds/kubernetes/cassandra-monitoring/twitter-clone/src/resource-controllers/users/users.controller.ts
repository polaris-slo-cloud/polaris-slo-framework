import { Express, Request, Response } from 'express';
import { User } from '../../model';
import { DEFAULT_QUERY_OPTS } from '../../util/cassandra';
import { getCurrTimestampForDb } from '../../util/time';
import { ResourceControllerBase } from '../resource.controller.base'

const USERS_PREFIX = '/users';

const queries = {
    insertUser: 'INSERT INTO users (username, email, password, time_joined) VALUES (:username, :email, :password, :time_joined)',
    selectUser: 'SELECT * FROM users WHERE username = ?',
};

export class UsersController extends ResourceControllerBase {

    protected registerEndpointsInternal(express: Express): void {
        express.put(
            USERS_PREFIX,
            (req, res) => this.executeSafely(req, res, () => this.createUser(req, res)),
        );
        // express.get(`${USERS_PREFIX}/:username`, (req, res) => this.getUser(req, res));
    }

    private async createUser(req: Request, res: Response): Promise<void> {
        const user: User = req.body;
        if (!user.email || !user.password || !user.username) {
            this.sendErrorResponse(res, 'Incomplete user object', { statusCode: 400 });
            return;
        }
        user.time_joined = getCurrTimestampForDb();

        await this.cassandra.execute(queries.insertUser, user, DEFAULT_QUERY_OPTS);
        this.sendJsonResponse(res, user);
    }

    // private async getUser(req: Request, res: Response): Promise<void> {
    //     const username = req.params.username;
    //     const result = await this.cassandra.execute(queries.selectUser, [ username ], DEFAULT_QUERY_OPTS);
    //     if (result.rows.length > 0) {
    //         const user = result.
    //     }
    // }

}
