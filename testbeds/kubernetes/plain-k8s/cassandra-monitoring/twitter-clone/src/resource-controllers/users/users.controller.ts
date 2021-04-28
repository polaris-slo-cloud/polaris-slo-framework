import { Express, Request, Response } from 'express';
import { User } from '../../model';
import { DbModelMapper, ModelType } from '../../util/cassandra';
import { getCurrTimestampForDb } from '../../util/time';
import { ResourceControllerBase } from '../resource.controller.base'

const USERS_PREFIX = '/users';

// const queries = {
//     insertUser: 'INSERT INTO users (username, email, password, time_joined) VALUES (:username, :email, :password, :time_joined)',
//     selectUser: 'SELECT * FROM users WHERE username = ?',
// };

export class UsersController extends ResourceControllerBase {

    private userMapper: DbModelMapper<User>;

    protected registerEndpointsInternal(express: Express): void {
        this.userMapper = this.dbMapper.forModel(ModelType.User);

        express.put(
            USERS_PREFIX,
            (req, res) => this.executeSafely(req, res, () => this.createUser(req, res)),
        );

        express.get(
            `${USERS_PREFIX}/:username`,
            (req, res) => this.getUser(req, res),
        );
    }

    private async createUser(req: Request, res: Response): Promise<void> {
        const user: User = req.body;
        if (!user.email || !user.password || !user.username) {
            this.sendErrorResponse(res, 'Incomplete user object', { statusCode: 400 });
            return;
        }
        user.time_joined = getCurrTimestampForDb();

        await this.userMapper.insert(user);
        this.sendJsonResponse(res, user);
    }

    private async getUser(req: Request, res: Response): Promise<void> {
        const username = req.params.username;
        const result = await this.userMapper.get({ username });

        if (result) {
            this.sendJsonResponse(res, result);
        } else {
            this.sendErrorResponse(res, 'User not found', { statusCode: 404 });
        }
    }

}
