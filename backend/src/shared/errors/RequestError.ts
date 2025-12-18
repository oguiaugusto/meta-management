class RequestError {
  constructor(
    public status: number,
    public error: string | Record<string, string>,
  ) {
    this.status = status;
    this.error = error;
  }
}

export default RequestError;
