
export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface Tweet {
    tweet_id: string;
    username: string;
    tweet_body: string;
    time: Date;
    location: GeoLocation;
}
