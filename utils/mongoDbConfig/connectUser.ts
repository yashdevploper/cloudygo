import mongoose from "mongoose";
import connect from "./userDb.config";

export default async function connectUser() {
  const DbConnectionState = mongoose.connection.readyState;

  if(DbConnectionState === 0){
    connect()
  }
  
}
