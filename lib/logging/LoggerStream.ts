import Logger from "./Logger"

class LoggerStream {
    write(text: string) {
        console.log(text)
        Logger.info(text)
    }
}

export default new LoggerStream()