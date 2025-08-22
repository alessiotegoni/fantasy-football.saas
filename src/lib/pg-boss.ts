import PgBoss from "pg-boss";

let boss: PgBoss | null = null;

export const getBoss = () => {
  if (boss) {
    return boss;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  boss = new PgBoss(process.env.DATABASE_URL);

  boss.on("error", (error) => console.error(error));

  return boss;
};
