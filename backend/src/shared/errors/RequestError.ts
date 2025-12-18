class RequestError {
  constructor(
    public status: number,
    public message: string,
  ) {
    this.status = status;
    this.message = message;
  }
}

export default RequestError;
