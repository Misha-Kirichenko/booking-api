export const extractTokenFromHeader = (
  headers: Record<string, any>,
  requestedType: string,
): string | undefined => {
  const [type, token] = headers["authorization"]?.split(' ') ?? [];
  return type === requestedType ? token : undefined;
};
