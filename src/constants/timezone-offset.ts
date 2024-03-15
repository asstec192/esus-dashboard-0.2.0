export const tzOffset = isNaN(Number(process.env.TZ_OFFSET))
  ? 0
  : Number(process.env.TZ_OFFSET);
