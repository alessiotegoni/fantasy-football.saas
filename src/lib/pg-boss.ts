import PgBoss from "pg-boss";

export const boss = new PgBoss(process.env.DATABASE_URL!);
await boss.start();

boss.on("error", (err) => console.error(err));
