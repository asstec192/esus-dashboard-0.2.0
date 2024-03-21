export const tzOffset = isNaN(Number(process.env.TZ_OFFSET))
  ? 3
  : Number(process.env.TZ_OFFSET);
