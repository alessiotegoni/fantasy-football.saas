export type JOB_NAME = "nomination-expiry";

export const getJobName = (tag: JOB_NAME) => tag;

export const getJobKey = (id: string, tag: JOB_NAME) => `${id}-${tag}`;
