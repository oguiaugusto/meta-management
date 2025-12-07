class RequestError {
  constructor(
    public status: number,
    public message: string | string[],
  ) {
    this.status = status;
    this.message = message;
  }
}

export default RequestError;
