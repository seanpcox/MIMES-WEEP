import { DataStore } from "@aws-amplify/datastore";
import { Period, Todo } from "../models/index.js";

/**
 * Function to save the score data
 * @param {Score data for game} scoreData 
 */
export async function save(scoreData) {
    // Persist the store data
    await DataStore.save(
        new Todo(scoreData)
      );
}

/**
 * Function to get the top ten results from the DB
 * @param {Game difficulty level} level 
 * @param {Period: DAY, MONTH, ALL} period 
 */
export function getTopTenResults(level, period) {
  var highScores = DataStore.query(Todo, 
    (hs) => hs.and(hs => [
      hs.level.eq(level),
      hs.datePeriod.eq(period)
    ]));

    console.log(highScores);
}

/**
 * const posts = await DataStore.query(Post, (c) =>
  c.or(c => [
    c.rating.gt(4),
    c.status.eq(PostStatus.ACTIVE)
  ]));
 */