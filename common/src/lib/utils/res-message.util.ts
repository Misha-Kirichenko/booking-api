export const RES_MESSAGE = {
  ERROR: {
    NOT_FOUND: (source: string): string => `${source} was not found`,
    BLOCKED: (reason: string) => `Your account is blocked. Reason: ${reason}`,
  }
}
