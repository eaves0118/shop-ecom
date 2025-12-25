import dotenv from "dotenv"
dotenv.config()

const getEnv = (key: string): string => {
    const value = process.env[key]
    if(!value){
        throw new Error(`Missing environment variable: ${key}. Please check the .env file`)
    }
    return value
}

export const ENV = {
    SECRET_KEY: getEnv("SECRET_KEY"),
    MONGO_URI: getEnv("MONGO_URI"),
    PORT: process.env.PORT || "8080"
}