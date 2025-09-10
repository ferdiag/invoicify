import createHttpError from "http-errors";

export const expectHttpError = async (p: Promise<any>, status: number, message?: string) => {
  await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
  await expect(p).rejects.toMatchObject(message ? { status, message } : { status });
};
