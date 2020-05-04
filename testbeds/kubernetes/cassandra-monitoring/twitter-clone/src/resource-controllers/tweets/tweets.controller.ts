import { types as CassandraTypes } from 'cassandra-driver';
import { Express, Request, Response } from 'express';
import { Tweet } from '../../model';
import { DbModelMapper, generateRandomLocation, ModelType } from '../../util';
import { ResourceControllerBase } from '../resource.controller.base';

const TWEETS_PREFIX = '/tweets';

const TWEETS_COUNT = 1000;

export class TweetsController extends ResourceControllerBase {

    private tweetsMapper: DbModelMapper<Tweet>;

    protected registerEndpointsInternal(express: Express): void {
        this.tweetsMapper = this.dbMapper.forModel(ModelType.Tweet);

        express.get(
            TWEETS_PREFIX,
            (req, res) => this.executeSafely(req, res, () => this.getMostRecentTweets(req, res)),
        );

        express.get(
            `${TWEETS_PREFIX}/user/:username`,
            (req, res) => this.executeSafely(req, res, () => this.getMostRecentTweetsByUser(req, res)),
        );

        express.put(
            `${TWEETS_PREFIX}/user/:username`,
            (req, res) => this.executeSafely(req, res, () => this.createTweet(req, res)),
        );

        express.get(
            `${TWEETS_PREFIX}/location/:lat/:long`,
            (req, res) => this.executeSafely(req, res, () => this.getMostRecentTweetsByLocation(req, res)),
        );
    }

    private async getMostRecentTweets(req: Request, res: Response): Promise<void> {
        const result = await this.tweetsMapper.findAll({ limit: TWEETS_COUNT });
        this.sendJsonResponse(res, result.toArray());
    }

    private async getMostRecentTweetsByUser(req: Request, res: Response): Promise<void> {
        const result = await this.tweetsMapper.find({ username: req.params.username }, { limit: TWEETS_COUNT });
        this.sendJsonResponse(res, result.toArray());
    }

    private async createTweet(req: Request, res: Response): Promise<void> {
        const tweet: Tweet = req.body;
        if (!tweet || !tweet.tweet_body) {
            this.sendErrorResponse(res, 'You must specify a Tweet body.', { statusCode: 400 });
            return;
        }

        tweet.username = req.params.username;
        tweet.time = new Date();
        tweet.tweet_id = CassandraTypes.TimeUuid.fromDate(tweet.time);
        if (!tweet.location) {
            tweet.location = generateRandomLocation();
        }

        await this.tweetsMapper.insert(tweet);
        this.sendJsonResponse(res, tweet);
    }

    private async getMostRecentTweetsByLocation(req: Request, res: Response): Promise<void> {
        throw new Error('This endpoint is not implemented.');
    }

}
