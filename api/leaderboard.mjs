import {neon} from '@neondatabase/serverless';
import service from '../server/leaderboard.cjs';
export default service.createHandler({sql:process.env.DATABASE_URL?neon(process.env.DATABASE_URL):null,secret:process.env.LEADERBOARD_SECRET});
