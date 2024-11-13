export class ResponseWrapper {
  static success(data: any){
    return {
      success: true,
      data,
    }
  }

  static failure(message:string) {
    return {
      success:false,
      message,
    }
  }
}